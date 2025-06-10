import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActions,
  Button,
  Skeleton,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Visibility,
  Share,
  Comment,
  Article as ArticleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { buildApiUrl, API_ENDPOINTS } from '../../api/config';
import { authenticatedFetch } from '../../api/authMiddleware';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: {
    name: string;
    avatar: string;
  };
  published_at: string;
  likes_count: number;
  views_count: number;
  comments_count: number;
  tags: string[];
  is_liked: boolean;
}

const Articles = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setError(null);
        const response = await authenticatedFetch(buildApiUrl(API_ENDPOINTS.articles));
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleLike = async (articleId: string) => {
    try {
      const response = await authenticatedFetch(buildApiUrl(`${API_ENDPOINTS.articles}/${articleId}/like`), {
        method: 'POST',
      });
      
      if (response.ok) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === articleId
              ? {
                  ...article,
                  is_liked: !article.is_liked,
                  likes_count: article.is_liked
                    ? article.likes_count - 1
                    : article.likes_count + 1,
                }
              : article
          )
        );
      }
    } catch (error) {
      console.error('Failed to like article:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const LoadingSkeleton = () => (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={32} width="80%" />
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="text" height={80} />
        </CardContent>
        <CardActions>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </CardActions>
      </Card>
    </Grid>
  );

  const canCreateArticle = user && ['admin', 'editor'].includes(user.role);

  const EmptyState = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      <ArticleIcon
        sx={{
          fontSize: 64,
          color: theme.palette.text.secondary,
          mb: 2,
        }}
      />
      <Typography variant="h5" gutterBottom>
        No Articles Yet
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        {canCreateArticle 
          ? 'Be the first to share your story with our community.'
          : 'Check back soon for community stories.'}
      </Typography>
      {canCreateArticle && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/articles/new')}
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Write an Article
        </Button>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-16px',
              left: 0,
              width: '80px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px',
            },
          }}
        >
          Community Stories
        </Typography>
        {canCreateArticle && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/articles/new')}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            Write Article
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && articles.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            : articles.map((article) => (
                <Grid item key={article.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={article.image_url}
                      alt={article.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          flexWrap: 'wrap',
                          mb: 2,
                        }}
                      >
                        {article.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.primary.main,
                              color: 'white',
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {article.excerpt}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={article.author.avatar}
                          alt={article.author.name}
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {article.author.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 'auto' }}
                        >
                          {formatDate(article.published_at)}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: 'space-between',
                        px: 2,
                        pb: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleLike(article.id)}
                            color={article.is_liked ? 'primary' : 'default'}
                          >
                            {article.is_liked ? <Favorite /> : <FavoriteBorder />}
                          </IconButton>
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {article.likes_count}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton size="small">
                            <Comment />
                          </IconButton>
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {article.comments_count}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Visibility sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 0.5 }}
                          >
                            {article.views_count}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        endIcon={<Share />}
                        onClick={() =>
                          navigator.share({
                            title: article.title,
                            text: article.excerpt,
                            url: window.location.href,
                          })
                        }
                      >
                        Share
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>
      )}
    </Container>
  );
};

export default Articles; 