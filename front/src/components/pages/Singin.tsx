import React, { useState } from 'react';
import {
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LoginPaper,
  LoginForm,
  StyledTextField,
  StyledButton,
  RegisterButton
} from './style/LoginStyle';
import { usuarioService } from '../../service/usuarioService';

const Singin: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    try {
      await usuarioService.register({ nombre, email, password });
      setLoading(false);
      setNombre('');
      setEmail('');
      setPassword('');
      setPassword2('');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrar usuario');
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
          Registro
        </Typography>
        {error && (<Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>)}
        <LoginForm>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="nombre"
              label="Nombre"
              name="nombre"
              autoComplete="name"
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
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
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Verificar Contraseña"
              type={showPassword2 ? 'text' : 'password'}
              id="password2"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              disabled={loading}
              error={Boolean(password2) && password !== password2}
              helperText={Boolean(password2) && password !== password2 ? 'Las contraseñas no coinciden' : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword2((v) => !v)}
                      edge="end"
                    >
                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !password || !password2 || password !== password2}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Registrarse'
              )}
            </StyledButton>
            <RegisterButton
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              ¿Ya estás registrado? Iniciar sesión
            </RegisterButton>
          </form>
        </LoginForm>
      </LoginPaper>
    </LoginContainer>
  );
};

export default Singin;
