import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Business,
  Link as LinkIcon,
  AttachMoney,
} from '@mui/icons-material';

// Mock data - replace with API call
const mockSponsors = Array.from({ length: 50 }, (_, index) => ({
  id: `sponsor-${index + 1}`,
  name: `Sponsor ${index + 1}`,
  logo: `https://via.placeholder.com/40?text=${index + 1}`,
  website: `https://sponsor${index + 1}.com`,
  type: index % 3 === 0 ? 'Platinum' : index % 3 === 1 ? 'Gold' : 'Silver',
  status: index % 4 === 0 ? 'active' : index % 4 === 1 ? 'pending' : index % 4 === 2 ? 'expired' : 'inactive',
  contribution: Math.floor(Math.random() * 10000) + 1000,
  joinedDate: new Date(2024, Math.floor(index / 2), (index % 30) + 1).toISOString(),
}));

const Sponsors = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSponsors = mockSponsors.filter(
    (sponsor) =>
      sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sponsor.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'error';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getSponsorTypeColor = (type: string) => {
    switch (type) {
      case 'Platinum':
        return '#E5E4E2';
      case 'Gold':
        return '#FFD700';
      case 'Silver':
        return '#C0C0C0';
      default:
        return '#C0C0C0';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Sponsors
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ 
              px: 3,
              py: 1,
              borderRadius: 1,
              textTransform: 'none',
            }}
          >
            Add Sponsor
          </Button>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search sponsors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sponsor</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Contribution</TableCell>
                <TableCell>Joined Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSponsors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sponsor) => (
                  <TableRow key={sponsor.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={sponsor.logo}
                          alt={sponsor.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          <Business />
                        </Avatar>
                        <Typography>{sponsor.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sponsor.type}
                        size="small"
                        sx={{
                          bgcolor: getSponsorTypeColor(sponsor.type),
                          color: 'text.primary',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon fontSize="small" color="action" />
                        <Typography
                          component="a"
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {new URL(sponsor.website).hostname}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sponsor.status}
                        size="small"
                        color={getStatusColor(sponsor.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney fontSize="small" color="action" />
                        {formatCurrency(sponsor.contribution)}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(sponsor.joinedDate)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSponsors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Sponsors; 