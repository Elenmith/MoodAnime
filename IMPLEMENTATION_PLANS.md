# 🚀 Plany Implementacji - Mood4Anime

## 🎯 Priorytet 1: System Komentarzy i Recenzji

### Backend Implementation

#### Model Comment
```javascript
// models/Comment.js
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  animeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date
}, {
  timestamps: true
});
```

#### API Endpoints
```javascript
// routes/comments.js
router.post('/anime/:animeId/comments', auth, createComment);
router.get('/anime/:animeId/comments', getComments);
router.put('/comments/:commentId', auth, updateComment);
router.delete('/comments/:commentId', auth, deleteComment);
router.post('/comments/:commentId/like', auth, toggleLike);
router.post('/comments/:commentId/reply', auth, addReply);
```

### Frontend Implementation

#### Comment Component
```javascript
// components/Comments/CommentSection.js
const CommentSection = ({ animeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/anime/${animeId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content: newComment, rating })
    });
    
    if (response.ok) {
      setNewComment('');
      setRating(0);
      fetchComments();
    }
  };

  return (
    <div className="comments-section">
      <h3>Komentarze i Recenzje</h3>
      
      {/* Formularz dodawania komentarza */}
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Napisz swoją recenzję..."
            maxLength={2000}
          />
          <div className="rating-input">
            <span>Ocena:</span>
            {[1,2,3,4,5,6,7,8,9,10].map(star => (
              <button
                key={star}
                type="button"
                className={star <= rating ? 'star active' : 'star'}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <button type="submit">Dodaj komentarz</button>
        </form>
      )}
      
      {/* Lista komentarzy */}
      <div className="comments-list">
        {comments.map(comment => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
```

## 🎮 Priorytet 2: System Osiągnięć

### Backend Implementation

#### Model Achievement
```javascript
// models/Achievement.js
const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['watching', 'rating', 'social', 'exploration'],
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: ['watch_count', 'genre_complete', 'rating_count', 'mood_complete', 'review_count'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    timeframe: {
      type: String,
      enum: ['lifetime', 'monthly', 'weekly'],
      default: 'lifetime'
    },
    specificValue: String // np. nazwa gatunku
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badge: String,
    title: String,
    unlockFeature: String
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
});

// Model UserAchievement
const userAchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0
  }
});
```

#### Achievement Service
```javascript
// services/achievementService.js
class AchievementService {
  static async checkAchievements(userId) {
    const user = await User.findById(userId).populate('watchlist.animeId');
    const achievements = await Achievement.find();
    const unlockedAchievements = await UserAchievement.find({ userId });
    
    const newAchievements = [];
    
    for (const achievement of achievements) {
      const isUnlocked = unlockedAchievements.some(ua => 
        ua.achievementId.toString() === achievement._id.toString()
      );
      
      if (!isUnlocked) {
        const progress = await this.calculateProgress(user, achievement);
        
        if (progress >= achievement.criteria.value) {
          await UserAchievement.create({
            userId,
            achievementId: achievement._id
          });
          
          newAchievements.push(achievement);
        }
      }
    }
    
    return newAchievements;
  }
  
  static async calculateProgress(user, achievement) {
    switch (achievement.criteria.type) {
      case 'watch_count':
        return user.watchlist.filter(item => item.status === 'completed').length;
        
      case 'genre_complete':
        const watchedGenres = new Set();
        user.watchlist.forEach(item => {
          if (item.status === 'completed' && item.animeId.genres) {
            item.animeId.genres.forEach(genre => watchedGenres.add(genre));
          }
        });
        return watchedGenres.size;
        
      case 'rating_count':
        return user.watchlist.filter(item => item.rating).length;
        
      case 'mood_complete':
        const watchedMoods = new Set();
        user.watchlist.forEach(item => {
          if (item.status === 'completed' && item.animeId.moods) {
            item.animeId.moods.forEach(mood => watchedMoods.add(mood));
          }
        });
        return watchedMoods.size;
        
      default:
        return 0;
    }
  }
}
```

### Frontend Implementation

#### Achievement Component
```javascript
// components/Achievements/AchievementCard.js
const AchievementCard = ({ achievement, progress, isUnlocked }) => {
  const progressPercentage = (progress / achievement.criteria.value) * 100;
  
  return (
    <div className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
      <div className="achievement-icon">
        <img src={achievement.icon} alt={achievement.name} />
        {isUnlocked && <div className="unlock-badge">✓</div>}
      </div>
      
      <div className="achievement-info">
        <h4>{achievement.name}</h4>
        <p>{achievement.description}</p>
        
        {!isUnlocked && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
            <span className="progress-text">
              {progress} / {achievement.criteria.value}
            </span>
          </div>
        )}
        
        {achievement.rewards.points > 0 && (
          <div className="rewards">
            <span className="points">+{achievement.rewards.points} pkt</span>
          </div>
        )}
      </div>
    </div>
  );
};
```

## 🤖 Priorytet 3: Chatbot Rekomendacji

### Backend Implementation

#### Chat Service
```javascript
// services/chatService.js
class ChatService {
  static async processMessage(userId, message) {
    const user = await User.findById(userId).populate('watchlist.animeId');
    const intent = await this.detectIntent(message);
    
    switch (intent.type) {
      case 'greeting':
        return this.generateGreeting(user);
        
      case 'mood_recommendation':
        return this.getMoodRecommendation(user, intent.mood);
        
      case 'genre_recommendation':
        return this.getGenreRecommendation(user, intent.genre);
        
      case 'explain_anime':
        return this.explainAnime(intent.animeTitle);
        
      case 'suggest_next':
        return this.suggestNextAnime(user);
        
      default:
        return this.generateFallbackResponse();
    }
  }
  
  static async detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Proste wykrywanie intencji
    if (lowerMessage.includes('cześć') || lowerMessage.includes('hello')) {
      return { type: 'greeting' };
    }
    
    if (lowerMessage.includes('smutny') || lowerMessage.includes('sad')) {
      return { type: 'mood_recommendation', mood: 'sad' };
    }
    
    if (lowerMessage.includes('wesoly') || lowerMessage.includes('happy')) {
      return { type: 'mood_recommendation', mood: 'happy' };
    }
    
    if (lowerMessage.includes('akcja') || lowerMessage.includes('action')) {
      return { type: 'genre_recommendation', genre: 'Action' };
    }
    
    if (lowerMessage.includes('co obejrzeć') || lowerMessage.includes('suggest')) {
      return { type: 'suggest_next' };
    }
    
    return { type: 'unknown' };
  }
  
  static async generateGreeting(user) {
    const stats = user.getStats();
    const timeOfDay = new Date().getHours();
    
    let greeting = '';
    if (timeOfDay < 12) greeting = 'Dzień dobry';
    else if (timeOfDay < 18) greeting = 'Dzień dobry';
    else greeting = 'Dobry wieczór';
    
    return {
      type: 'greeting',
      message: `${greeting} ${user.username}! 👋 Widzę, że obejrzałeś już ${stats.completed} anime. Jak mogę Ci dzisiaj pomóc?`,
      suggestions: [
        'Poleć mi coś smutnego',
        'Chcę coś akcji',
        'Co obejrzeć?',
        'Wyjaśnij mi anime'
      ]
    };
  }
  
  static async getMoodRecommendation(user, mood) {
    const watchedAnimeIds = user.watchlist.map(item => item.animeId._id);
    
    const recommendation = await Anime.findOne({
      _id: { $nin: watchedAnimeIds },
      moods: { $in: [mood] }
    }).sort({ rating: -1 });
    
    if (!recommendation) {
      return {
        type: 'no_recommendation',
        message: `Przepraszam, nie znalazłem anime w nastroju "${mood}". Spróbuj innego nastroju!`
      };
    }
    
    return {
      type: 'recommendation',
      message: `Polecam Ci "${recommendation.title}"! To anime w nastroju ${mood} z oceną ${recommendation.rating}/10. ${recommendation.synopsis.substring(0, 150)}...`,
      anime: recommendation,
      suggestions: [
        'Pokaż więcej szczegółów',
        'Dodaj do listy',
        'Poleć coś podobnego'
      ]
    };
  }
}
```

### Frontend Implementation

#### Chat Interface
```javascript
// components/Chat/ChatInterface.js
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useUser();
  
  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Dodaj wiadomość użytkownika
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message })
      });
      
      const botResponse = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse.message,
        suggestions: botResponse.suggestions,
        anime: botResponse.anime,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>🎌 Anime Assistant</h3>
        <p>Zapytaj mnie o rekomendacje!</p>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <span>Pisanie...</span>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
          placeholder="Napisz wiadomość..."
        />
        <button onClick={() => sendMessage(inputMessage)}>
          Wyślij
        </button>
      </div>
    </div>
  );
};
```

## 📱 Priorytet 4: Aplikacja Mobilna (React Native)

### Struktura Projektu
```javascript
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import MoodScreen from './src/screens/MoodScreen';
import AnimeDetailScreen from './src/screens/AnimeDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Moods" component={MoodScreen} />
        <Tab.Screen name="Watchlist" component={WatchlistScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
```

### Home Screen
```javascript
// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl
} from 'react-native';
import { useUser } from '../context/UserContext';
import AnimeCard from '../components/AnimeCard';
import MoodSelector from '../components/MoodSelector';

const HomeScreen = ({ navigation }) => {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  
  const fetchData = async () => {
    try {
      const [featuredRes, recommendationsRes] = await Promise.all([
        fetch('/api/anime/featured'),
        user ? fetch('/api/users/recommendations') : null
      ]);
      
      const featured = await featuredRes.json();
      setFeaturedAnime(featured);
      
      if (recommendationsRes) {
        const recs = await recommendationsRes.json();
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { type: 'mood-selector' },
          { type: 'featured', title: 'Polecane Anime', data: featuredAnime },
          { type: 'recommendations', title: 'Dla Ciebie', data: recommendations }
        ]}
        renderItem={({ item }) => {
          switch (item.type) {
            case 'mood-selector':
              return <MoodSelector navigation={navigation} />;
            case 'featured':
            case 'recommendations':
              return (
                <View>
                  <Text style={styles.sectionTitle}>{item.title}</Text>
                  <FlatList
                    horizontal
                    data={item.data}
                    renderItem={({ item: anime }) => (
                      <AnimeCard
                        anime={anime}
                        onPress={() => navigation.navigate('AnimeDetail', { anime })}
                      />
                    )}
                    keyExtractor={item => item._id}
                  />
                </View>
              );
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
    color: '#333'
  }
});
```

## 💰 Priorytet 5: Zaawansowana Monetyzacja

### Premium Subscription System

#### Backend Implementation
```javascript
// models/Subscription.js
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'pro'],
    default: 'basic'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  features: {
    unlimitedRecommendations: { type: Boolean, default: false },
    advancedAnalytics: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    adFree: { type: Boolean, default: false },
    exclusiveContent: { type: Boolean, default: false },
    exportData: { type: Boolean, default: false }
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'PLN'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'apple_pay', 'google_pay']
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

#### Premium Features Service
```javascript
// services/premiumService.js
class PremiumService {
  static async checkPremiumFeatures(userId) {
    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    });
    
    if (!subscription) {
      return {
        isPremium: false,
        features: this.getBasicFeatures()
      };
    }
    
    return {
      isPremium: true,
      plan: subscription.plan,
      features: subscription.features,
      expiresAt: subscription.endDate
    };
  }
  
  static getBasicFeatures() {
    return {
      unlimitedRecommendations: false,
      advancedAnalytics: false,
      prioritySupport: false,
      adFree: false,
      exclusiveContent: false,
      exportData: false
    };
  }
  
  static async getExclusiveContent(userId) {
    const premium = await this.checkPremiumFeatures(userId);
    
    if (!premium.isPremium) {
      throw new Error('Premium subscription required');
    }
    
    // Pobierz ekskluzywne treści
    return await Anime.find({
      isExclusive: true,
      premiumOnly: true
    }).limit(20);
  }
  
  static async exportUserData(userId) {
    const premium = await this.checkPremiumFeatures(userId);
    
    if (!premium.features.exportData) {
      throw new Error('Data export not available in your plan');
    }
    
    const user = await User.findById(userId).populate('watchlist.animeId');
    
    return {
      profile: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        preferences: user.preferences
      },
      watchlist: user.watchlist.map(item => ({
        title: item.animeId.title,
        status: item.status,
        rating: item.rating,
        review: item.review,
        addedAt: item.addedAt
      })),
      statistics: user.getStats(),
      achievements: await UserAchievement.find({ userId }).populate('achievementId')
    };
  }
}
```

### Frontend Implementation

#### Premium Features Component
```javascript
// components/Premium/PremiumFeatures.js
const PremiumFeatures = () => {
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  
  useEffect(() => {
    fetchPremiumStatus();
  }, []);
  
  const fetchPremiumStatus = async () => {
    try {
      const response = await fetch('/api/users/premium-status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const status = await response.json();
      setPremiumStatus(status);
    } catch (error) {
      console.error('Error fetching premium status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpgrade = async (plan) => {
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan })
      });
      
      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl; // Przekierowanie do Stripe
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };
  
  if (loading) return <div>Ładowanie...</div>;
  
  return (
    <div className="premium-features">
      <div className="premium-header">
        <h2>Premium Features</h2>
        {premiumStatus?.isPremium ? (
          <div className="premium-badge">
            <span>Premium Active</span>
            <small>Expires: {new Date(premiumStatus.expiresAt).toLocaleDateString()}</small>
          </div>
        ) : (
          <p>Odblokuj pełny potencjał Mood4Anime</p>
        )}
      </div>
      
      <div className="features-grid">
        <FeatureCard
          title="Nieograniczone Rekomendacje"
          description="Otrzymuj spersonalizowane rekomendacje bez limitów"
          icon="🎯"
          available={premiumStatus?.features?.unlimitedRecommendations}
        />
        
        <FeatureCard
          title="Zaawansowana Analityka"
          description="Szczegółowe statystyki i wykresy oglądania"
          icon="📊"
          available={premiumStatus?.features?.advancedAnalytics}
        />
        
        <FeatureCard
          title="Bez Reklam"
          description="Czyste doświadczenie bez reklam"
          icon="🚫"
          available={premiumStatus?.features?.adFree}
        />
        
        <FeatureCard
          title="Treści Ekskluzywne"
          description="Dostęp do ekskluzywnych anime i recenzji"
          icon="⭐"
          available={premiumStatus?.features?.exclusiveContent}
        />
        
        <FeatureCard
          title="Eksport Danych"
          description="Pobierz wszystkie swoje dane w formacie JSON"
          icon="📤"
          available={premiumStatus?.features?.exportData}
        />
        
        <FeatureCard
          title="Priorytetowe Wsparcie"
          description="Szybka pomoc techniczna"
          icon="🎧"
          available={premiumStatus?.features?.prioritySupport}
        />
      </div>
      
      {!premiumStatus?.isPremium && (
        <div className="upgrade-section">
          <h3>Wybierz Plan</h3>
          <div className="plans">
            <PlanCard
              name="Premium"
              price="19.99"
              period="miesiąc"
              features={[
                'Nieograniczone rekomendacje',
                'Bez reklam',
                'Zaawansowana analityka'
              ]}
              onUpgrade={() => handleUpgrade('premium')}
            />
            
            <PlanCard
              name="Pro"
              price="39.99"
              period="miesiąc"
              features={[
                'Wszystko z Premium',
                'Treści ekskluzywne',
                'Eksport danych',
                'Priorytetowe wsparcie'
              ]}
              onUpgrade={() => handleUpgrade('pro')}
              popular
            />
          </div>
        </div>
      )}
    </div>
  );
};
```

## 📊 Priorytet 6: Business Intelligence

### Analytics Dashboard

#### Backend Analytics Service
```javascript
// services/analyticsService.js
class AnalyticsService {
  static async getDashboardData() {
    const [
      userStats,
      contentStats,
      engagementStats,
      revenueStats
    ] = await Promise.all([
      this.getUserStats(),
      this.getContentStats(),
      this.getEngagementStats(),
      this.getRevenueStats()
    ]);
    
    return {
      users: userStats,
      content: contentStats,
      engagement: engagementStats,
      revenue: revenueStats
    };
  }
  
  static async getUserStats() {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const retentionRate = await this.calculateRetentionRate();
    
    return {
      total: totalUsers,
      active: activeUsers,
      new: newUsers,
      retention: retentionRate
    };
  }
  
  static async getContentStats() {
    const totalAnime = await Anime.countDocuments();
    const animeWithRatings = await Anime.countDocuments({
      'ratings.0': { $exists: true }
    });
    
    const popularGenres = await Anime.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const popularMoods = await Anime.aggregate([
      { $unwind: '$moods' },
      { $group: { _id: '$moods', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    return {
      totalAnime,
      animeWithRatings,
      popularGenres,
      popularMoods
    };
  }
  
  static async getEngagementStats() {
    const totalWatchlistItems = await User.aggregate([
      { $unwind: '$watchlist' },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);
    
    const averageRating = await User.aggregate([
      { $unwind: '$watchlist' },
      { $match: { 'watchlist.rating': { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$watchlist.rating' } } }
    ]);
    
    const totalComments = await Comment.countDocuments();
    
    return {
      totalWatchlistItems: totalWatchlistItems[0]?.total || 0,
      averageRating: averageRating[0]?.avg || 0,
      totalComments
    };
  }
  
  static async getRevenueStats() {
    const activeSubscriptions = await Subscription.countDocuments({
      status: 'active',
      endDate: { $gt: new Date() }
    });
    
    const monthlyRevenue = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    return {
      activeSubscriptions,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    };
  }
}
```

### Frontend Dashboard

#### Analytics Dashboard Component
```javascript
// components/Analytics/Dashboard.js
const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);
  
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Ładowanie analityki...</div>;
  
  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Business Intelligence Dashboard</h2>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7d">Ostatnie 7 dni</option>
          <option value="30d">Ostatnie 30 dni</option>
          <option value="90d">Ostatnie 90 dni</option>
        </select>
      </div>
      
      <div className="metrics-grid">
        <MetricCard
          title="Użytkownicy"
          value={data.users.total}
          change={data.users.new}
          changeType="positive"
          icon="👥"
        />
        
        <MetricCard
          title="Aktywni Użytkownicy"
          value={data.users.active}
          change={data.users.retention}
          changeType="percentage"
          icon="🔥"
        />
        
        <MetricCard
          title="Anime w Bazie"
          value={data.content.totalAnime}
          change={data.content.animeWithRatings}
          changeType="info"
          icon="🎌"
        />
        
        <MetricCard
          title="Miesięczny Przychód"
          value={`${data.revenue.monthlyRevenue} PLN`}
          change={data.revenue.activeSubscriptions}
          changeType="positive"
          icon="💰"
        />
      </div>
      
      <div className="charts-section">
        <div className="chart-container">
          <h3>Popularne Gatunki</h3>
          <BarChart data={data.content.popularGenres} />
        </div>
        
        <div className="chart-container">
          <h3>Popularne Nastroje</h3>
          <PieChart data={data.content.popularMoods} />
        </div>
      </div>
      
      <div className="engagement-section">
        <h3>Engagement Metrics</h3>
        <div className="engagement-grid">
          <div className="engagement-card">
            <h4>Elementy na Listach</h4>
            <p className="big-number">{data.engagement.totalWatchlistItems}</p>
          </div>
          
          <div className="engagement-card">
            <h4>Średnia Ocena</h4>
            <p className="big-number">{data.engagement.averageRating.toFixed(1)}/10</p>
          </div>
          
          <div className="engagement-card">
            <h4>Komentarze</h4>
            <p className="big-number">{data.engagement.totalComments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 🚀 Plan Implementacji - Harmonogram

### Tydzień 1-2: System Komentarzy
- [ ] Backend: Model Comment, API endpoints
- [ ] Frontend: CommentSection, CommentCard
- [ ] Testy i optymalizacja

### Tydzień 3-4: System Osiągnięć
- [ ] Backend: Achievement models, service
- [ ] Frontend: Achievement components
- [ ] Integracja z systemem użytkowników

### Tydzień 5-6: Chatbot
- [ ] Backend: Chat service, intent detection
- [ ] Frontend: Chat interface
- [ ] Integracja z rekomendacjami

### Tydzień 7-8: Premium Features
- [ ] Backend: Subscription system
- [ ] Frontend: Premium UI
- [ ] Integracja z płatnościami

### Tydzień 9-10: Analytics
- [ ] Backend: Analytics service
- [ ] Frontend: Dashboard
- [ ] Wizualizacje danych

### Tydzień 11-12: Aplikacja Mobilna (MVP)
- [ ] React Native setup
- [ ] Podstawowe ekrany
- [ ] Integracja z API

## 📈 Metryki Sukcesu

### KPI dla każdej funkcjonalności:

#### System Komentarzy
- Liczba komentarzy na anime
- Średnia długość komentarza
- Współczynnik zaangażowania

#### System Osiągnięć
- Liczba odblokowanych osiągnięć
- Retencja użytkowników
- Czas spędzony w aplikacji

#### Chatbot
- Liczba konwersacji
- Skuteczność rekomendacji
- Satysfakcja użytkowników

#### Premium Features
- Konwersja na premium
- MRR (Monthly Recurring Revenue)
- Churn rate

#### Analytics
- Dokładność danych
- Szybkość ładowania
- Użyteczność dashboardu
