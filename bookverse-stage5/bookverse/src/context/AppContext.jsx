import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../utils/storage';

const C = createContext(null);
export const API_BASE = "http://127.0.0.1:8000";

export function AppProvider({ children }) {
  // Live database books
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState(storage.get('reviews', []));
  const [library, setLibrary] = useState(storage.get('library', {}));

  const [theme, setTheme] = useState(storage.get('theme', 'light'));
  const [wishlist, setWishlist] = useState(storage.get('wishlist', []));
  const [favorites, setFavorites] = useState(storage.get('favorites', []));
  const [progress, setProgressState] = useState(storage.get('progress', {}));
  const [ratings, setRatings] = useState(storage.get('ratings', {}));
  const [following, setFollowing] = useState(storage.get('following', []));
  const [communityLikes, setCommunityLikes] = useState(storage.get('communityLikes', []));
  const [comments, setComments] = useState(storage.get('communityComments', {}));
  const [joinedClubs, setJoinedClubs] = useState(storage.get('joinedClubs', []));
  const [joinedChallenges, setJoinedChallenges] = useState(storage.get('joinedChallenges', []));
  const [challengeProgress, setChallengeProgress] = useState(storage.get('challengeProgress', {}));
  const [clubDiscussions, setClubDiscussions] = useState(storage.get('clubDiscussions', {}));
  const [notifications, setNotifications] = useState(storage.get('notifications', [
    { id: 'n1', text: 'Maya followed you', read: false, time: '2h ago' },
    { id: 'n2', text: 'Someone liked your review of Dune', read: false, time: '5h ago' },
    { id: 'n3', text: 'Fantasy Fellowship posted a club update', read: true, time: '1d ago' },
  ]));
  const [profile, setProfile] = useState(storage.get('profile', { 
    name: 'Alex Morgan', 
    username: 'alexreads', 
    bio: 'Collecting stories, one chapter at a time.', 
    avatar: 'A', 
    followers: 842, 
    following: 316, 
    favoriteGenres: ['Fantasy', 'Fiction', 'Mystery'] 
  }));
  const [lists, setLists] = useState(storage.get('readingLists', [
    { id: '1', name: 'Weekend Reads', books: ['1', '3'] },
    { id: '2', name: 'Fantasy Favorites', books: ['2', '9'] },
    { id: '3', name: 'Books To Read This Year', books: ['6', '15'] },
  ]));
  const [goals, setGoals] = useState(storage.get('goals', [
    { id: 'g1', name: 'Read 20 books this year', target: 20, current: 8, unit: 'books' },
    { id: 'g2', name: 'Read 5,000 pages', target: 5000, current: 2184, unit: 'pages' },
    { id: 'g3', name: 'Read 5 books this month', target: 5, current: 3, unit: 'books' },
  ]));

  const normalizeBook = (b, index = 0) => {
    const cats = ['Fiction', 'Fantasy', 'Science Fiction', 'Classics', 'Technology', 'Mystery', 'Thriller', 'Manga'];
    const assignedCat = b.category || cats[index % cats.length];
    return {
      ...b,
      category: assignedCat,
      categories: b.categories || [assignedCat],
      pages: b.pages || (280 + ((index * 47) % 320)),
      publishedYear: b.publishedYear || b.published_year || 2020,
      rating: b.rating ? Number(b.rating) : Number((4.3 + (index % 5) * 0.12).toFixed(1)),
      ratingCount: b.ratingCount || (1200 + index * 530),
      trending: b.trending !== undefined ? b.trending : (index % 2 === 0),
      featured: b.featured !== undefined ? b.featured : (index < 6),
      tags: b.tags || [assignedCat, 'Recommended', 'Popular']
    };
  };

  // 1. Fetch books from FastAPI backend on load
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE}/books/`);
      if (response.ok) {
        const data = await response.json();
        const normalized = data.map((b, idx) => normalizeBook(b, idx));
        setBooks(normalized);
        return normalized;
      }
    } catch (error) {
      console.error("Error fetching books from FastAPI:", error);
    }
  };

  // 2. Fetch reviews from FastAPI backend on load
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE}/reviews/`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
        return data;
      }
    } catch (error) {
      console.error("Error fetching reviews from FastAPI:", error);
    }
  };

  // 3. Fetch reading list from FastAPI backend on load
  const fetchReadingList = async () => {
    try {
      const response = await fetch(`${API_BASE}/reading-list/`);
      if (response.ok) {
        const data = await response.json();
        const map = {};
        data.forEach(item => {
          const st = item.status === 'completed' ? 'finished' : (item.status === 'want_to_read' ? 'want' : item.status);
          map[item.book_id] = st;
        });
        setLibrary(prev => ({ ...prev, ...map }));
      }
    } catch (error) {
      console.error("Error fetching reading list from FastAPI:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchReviews();
    fetchReadingList();
  }, []);

  // Sync state to local storage as fallback / persistent cache
  useEffect(() => { document.documentElement.dataset.theme = theme; storage.set('theme', theme); }, [theme]);
  useEffect(() => storage.set('library', library), [library]);
  useEffect(() => storage.set('wishlist', wishlist), [wishlist]);
  useEffect(() => storage.set('favorites', favorites), [favorites]);
  useEffect(() => storage.set('progress', progress), [progress]);
  useEffect(() => storage.set('ratings', ratings), [ratings]);
  useEffect(() => storage.set('reviews', reviews), [reviews]);
  useEffect(() => storage.set('following', following), [following]);
  useEffect(() => storage.set('communityLikes', communityLikes), [communityLikes]);
  useEffect(() => storage.set('communityComments', comments), [comments]);
  useEffect(() => storage.set('joinedClubs', joinedClubs), [joinedClubs]);
  useEffect(() => storage.set('joinedChallenges', joinedChallenges), [joinedChallenges]);
  useEffect(() => storage.set('challengeProgress', challengeProgress), [challengeProgress]);
  useEffect(() => storage.set('clubDiscussions', clubDiscussions), [clubDiscussions]);
  useEffect(() => storage.set('notifications', notifications), [notifications]);
  useEffect(() => storage.set('profile', profile), [profile]);
  useEffect(() => storage.set('readingLists', lists), [lists]);
  useEffect(() => storage.set('goals', goals), [goals]);

  const toggle = (set, id) => set(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);

  // Network-connected setStatus for reading list
  const setStatus = async (id, status) => {
    setLibrary(v => {
      const next = { ...v };
      if (!status) delete next[id]; else next[id] = status;
      return next;
    });

    try {
      if (!status) {
        await fetch(`${API_BASE}/reading-list/${id}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_BASE}/reading-list/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ book_id: id, status })
        });
      }
    } catch (error) {
      console.error("Error syncing reading list status to backend:", error);
    }
  };

  const setProgress = (id, pageOrPercent, pages) => setProgressState(v => {
    const current = v[id] || {};
    if (typeof pageOrPercent === 'number' && pages) {
      return { ...v, [id]: { page: Math.max(0, Math.min(pages, pageOrPercent)), pages, percent: Math.round((pageOrPercent / pages) * 100) } };
    }
    const percent = Math.max(0, Math.min(100, Number(pageOrPercent) || 0));
    return { ...v, [id]: { ...current, percent, page: current.pages ? Math.round(current.pages * percent / 100) : (current.page || 0) } };
  });

  // API Methods for Books
  const addBookApi = async (bookData) => {
    try {
      const response = await fetch(`${API_BASE}/books/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create book');
      }
      const newBook = await response.json();
      const normalizedBook = normalizeBook(newBook, 0);
      setBooks(prev => [normalizedBook, ...prev]);
      return normalizedBook;
    } catch (error) {
      console.error("Error creating book via API:", error);
      throw error;
    }
  };

  const deleteBookApi = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE}/books/${bookId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setBooks(prev => prev.filter(b => b.id !== bookId));
      }
    } catch (error) {
      console.error("Error deleting book via API:", error);
    }
  };

  // API Methods for Reviews
  const submitReviewApi = async ({ book_id, rating, review_text }) => {
    try {
      const response = await fetch(`${API_BASE}/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id, rating, review_text })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit review');
      }
      const newReview = await response.json();
      setReviews(prev => [newReview, ...prev]);
      setRatings(v => ({ ...v, [book_id]: rating }));
      return newReview;
    } catch (error) {
      console.error("Error submitting review via API:", error);
      throw error;
    }
  };

  const deleteReviewApi = async (reviewId) => {
    try {
      const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setReviews(prev => prev.filter(r => (r.id !== reviewId && r.review_id !== reviewId)));
      }
    } catch (error) {
      console.error("Error deleting review via API:", error);
    }
  };

  // API Method for Image Upload
  const uploadImageApi = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/upload/`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Image upload failed');
    }
    const data = await response.json();
    return data.url;
  };

  return <C.Provider value={{
    books, setBooks, fetchBooks, addBookApi, deleteBookApi,
    reviews, setReviews, fetchReviews, submitReviewApi, deleteReviewApi,
    uploadImageApi,
    theme, setTheme, library, wishlist, favorites, progress, ratings, following,
    lists, setLists, goals, setGoals, setStatus, updateReadingShelf: setStatus, communityLikes, comments, joinedClubs, joinedChallenges, challengeProgress, clubDiscussions, notifications, profile, setProfile,
    setProgress, setRating: (id, r) => setRatings(v => ({ ...v, [id]: r })),
    toggleWishlist: id => toggle(setWishlist, id), toggleFavorite: id => toggle(setFavorites, id),
    toggleFollow: id => toggle(setFollowing, id),
    toggleCommunityLike: id => toggle(setCommunityLikes, id),
    addComment: (postId, text) => setComments(v => ({ ...v, [postId]: [...(v[postId] || []), { id: `c${Date.now()}`, user: profile.name, text }] })),
    toggleClub: id => toggle(setJoinedClubs, id),
    toggleChallenge: id => toggle(setJoinedChallenges, id),
    setChallengeValue: (id, value) => setChallengeProgress(v => ({ ...v, [id]: value })),
    addClubDiscussion: (id, text) => setClubDiscussions(v => ({ ...v, [id]: [...(v[id] || []), { id: `d${Date.now()}`, user: profile.name, text }] })),
    markNotificationRead: id => setNotifications(v => v.map(n => n.id === id ? { ...n, read: true } : n)),
    markAllNotificationsRead: () => setNotifications(v => v.map(n => ({ ...n, read: true }))),
    unreadNotifications: notifications.filter(n => !n.read).length,
  }}>{children}</C.Provider>;
}
export const useApp = () => useContext(C);