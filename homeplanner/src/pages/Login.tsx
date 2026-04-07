import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card, Stack, Container } from '../components';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(username, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <Container size="sm">
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card padding="lg" className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary">HomeHub</h1>
            <p className="text-text-secondary mt-2">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Input
                label="Usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
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

              {error && (
                <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>

              <p className="text-center text-sm text-text-secondary">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => navigate('/register')}
                >
                  Regístrate
                </button>
              </p>
            </Stack>
          </form>
        </Card>
      </div>
    </Container>
  );
}