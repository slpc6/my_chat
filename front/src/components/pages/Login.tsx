import React, { useState } from 'react';
import {
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { usuarioService } from '../../service/usuarioService';
import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LoginPaper,
  LoginForm,
  StyledTextField,
  StyledButton,
  RegisterButton
} from './style/LoginStyle';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await usuarioService.login(email, password);
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response));
        navigate('/main');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <LoginPaper>
        <Typography component="h1" variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>
        {error && (<Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>)}
        <LoginForm>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión'
              )}
            </StyledButton>
            <RegisterButton
              fullWidth
              variant="text"
              onClick={() => navigate('/singin')}
              disabled={loading}
            >
              ¿No tienes cuenta? Regístrate
            </RegisterButton>
          </form>
        </LoginForm>
      </LoginPaper>
    </LoginContainer>
  );
};

export default Login;
