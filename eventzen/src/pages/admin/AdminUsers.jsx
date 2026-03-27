import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Button, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getAllUsers, makeUserAdmin } from '../../api/api';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

/**
 * Access control interface allowing privileged operators to audit user accounts 
 * and escalate platform privileges.
 */
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeAdmin = async (id) => {
    setActionLoading(id);
    try {
      await makeUserAdmin(id);
      toast.success('User updated to Admin successfully');
      await fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.4rem' }, color: '#111827', letterSpacing: '-0.03em' }}>
              Manage Users
            </Typography>
            <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280' }}>
              {users.length} registered users
            </Typography>
          </motion.div>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#6366F1' }} />
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    {['ID', 'Name', 'Email', 'Role', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontFamily: 'Syne', fontWeight: 700, color: '#374151', fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.2s' }}>
                      <TableCell sx={{ fontFamily: 'Outfit', color: '#9CA3AF', fontSize: '0.82rem' }}>#{u.id}</TableCell>
                      <TableCell sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#111827' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {u.name}
                          {u.role === 'ADMIN' && <AdminPanelSettingsIcon sx={{ color: '#F59E0B', fontSize: 16 }} />}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Outfit', color: '#4B5563', fontSize: '0.85rem' }}>{u.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={u.role} 
                          size="small"
                          sx={{ 
                            fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.75rem',
                            bgcolor: u.role === 'ADMIN' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            color: u.role === 'ADMIN' ? '#D97706' : '#6366F1',
                            borderRadius: '6px'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        {u.role !== 'ADMIN' ? (
                          <Button
                            onClick={() => handleMakeAdmin(u.id)}
                            disabled={actionLoading === u.id}
                            variant="outlined"
                            size="small"
                            startIcon={actionLoading === u.id ? <CircularProgress size={14} /> : <AdminPanelSettingsIcon />}
                            sx={{
                              fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px',
                              borderColor: '#6366F1', color: '#6366F1',
                              '&:hover': { borderColor: '#4F46E5', bgcolor: 'rgba(99,102,241,0.04)' }
                            }}
                          >
                            Make Admin
                          </Button>
                        ) : (
                          <Typography sx={{ fontFamily: 'Outfit', color: '#9CA3AF', fontSize: '0.85rem', fontStyle: 'italic' }}>
                            Admin User
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, fontFamily: 'Outfit', color: '#9CA3AF' }}>
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
