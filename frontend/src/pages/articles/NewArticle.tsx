import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Chip,
  IconButton,
  Alert,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { buildApiUrl, API_ENDPOINTS } from '../../api/config';
import { authenticatedFetch } from '../../api/authMiddleware';

interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  tags: string[];
}

const NewArticle = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(buildApiUrl(API_ENDPOINTS.articles), {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create article');
      }

      navigate('/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 6,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '2px',
          },
        }}
      >
        Write New Article
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            required
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            multiline
            rows={6}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            required
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Add Tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <AddIcon />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  deleteIcon={<CloseIcon />}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/articles')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Article'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewArticle; 