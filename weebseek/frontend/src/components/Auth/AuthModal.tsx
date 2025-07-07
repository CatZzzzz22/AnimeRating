import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, TextField } from "@mui/material";
import { useState } from "react";
import { apiFetch } from "../../helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ open, onClose, onSuccess }: Props) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (mode === 'register' && password !== confirm) {
      setError("Password does not match");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<{
        message: string;
        user_id: number;
        username: string;
      }>(
        mode === 'login' ? '/api/auth/login' : '/api/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        }
      );
      console.log(res);

      onSuccess();
      onClose();

      setUsername('');
      setPassword('');
      setConfirm('');
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Tabs
          value={mode}
          onChange={(_, v) => {
            setMode(v);
            setError(null);
          }}
          variant="fullWidth"
        >
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
          />
          {mode === 'register' && (
            <TextField
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              fullWidth
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !username || !password || (mode === 'register' && !confirm)}
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AuthModal