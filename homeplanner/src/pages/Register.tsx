import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card, Stack, Container } from '../components';

export function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      setLoading(false);
      return;
    }

    const { error } = await signUp(username, password, name);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Container size="sm">
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
          <Card padding="lg" className="w-full max-w-md text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">¡Registro exitoso!</h1>
            <p className="text-text-secondary mb-6">
              Ya puedes usar la app. ¡Bienvenido a HomeHub!
            </p>
            <Button onClick={() => navigate('/')}>
              Ir al inicio
            </Button>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card padding="lg" className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary">Crear cuenta</h1>
            <p className="text-text-secondary mt-2">Únete a HomeHub</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Input
                label="Nombre"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
              />

              <Input
                label="Usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                required
              />

              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {error && (
                <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </Button>

              <p className="text-center text-sm text-text-secondary">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => navigate('/login')}
                >
                  Inicia sesión
                </button>
              </p>
            </Stack>
          </form>
        </Card>
      </div>
    </Container>
  );
}