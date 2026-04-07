import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Check, Users, LogOut } from 'lucide-react';
import { Button, Card, Input, Stack, Row, Container } from '../components';
import { api, useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Member {
  id: string;
  username: string;
  name: string;
}

interface Household {
  id: string;
  name: string;
  code: string;
}

interface ProfileData {
  user: {
    id: string;
    username: string;
    name: string;
  };
  household: Household | null;
  members: Member[];
}

export function Profile() {
  const { user: authUser, signOut } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });
      return response.data;
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await api.post('/households/join', { code }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setShowJoinForm(false);
      setJoinCode('');
      setJoinError('');
    },
    onError: (error: any) => {
      setJoinError(error.response?.data?.error || 'Error al unirse a la casa');
    },
  });

  const createHouseholdMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post('/households/create', { name }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Household created:', data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.removeQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      console.error('Error creating household:', error);
      alert(error.response?.data?.error || 'Error al crear la casa');
    },
  });

  const copyCode = () => {
    if (profile?.household?.code) {
      navigator.clipboard.writeText(profile.household.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = () => {
    if (joinCode.trim()) {
      joinMutation.mutate(joinCode.trim());
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Container size="md">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="md">
      <Stack gap="lg" className="py-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Mi Perfil</h1>
          <p className="text-text-secondary">Gestiona tu cuenta y casa</p>
        </div>

        {/* User Info Card */}
        <Card padding="lg">
          <Stack gap="md">
            <h2 className="text-lg font-semibold text-text-primary">Información personal</h2>
            <Row justify="between">
              <span className="text-text-secondary">Nombre</span>
              <span className="font-medium text-text-primary">{profile?.user.name}</span>
            </Row>
            <Row justify="between">
              <span className="text-text-secondary">Usuario</span>
              <span className="font-medium text-text-primary">@{profile?.user.username}</span>
            </Row>
            <Row justify="between">
              <span className="text-text-secondary">ID</span>
              <span className="font-mono text-xs text-text-tertiary">{profile?.user.id}</span>
            </Row>
          </Stack>
        </Card>

        {/* Household Card */}
        <Card padding="lg">
          <Stack gap="md">
            <Row justify="between" align="center">
              <h2 className="text-lg font-semibold text-text-primary">Mi Casa</h2>
            </Row>
            
            {profile?.household ? (
              <>
                <Row justify="between">
                  <span className="text-text-secondary">Nombre</span>
                  <span className="font-medium text-text-primary">{profile.household.name}</span>
                </Row>
                <Row justify="between" align="center">
                  <span className="text-text-secondary">Código</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">{profile.household.code}</span>
                    <button
                      onClick={copyCode}
                      className="p-2 hover:bg-secondary-light rounded-lg transition-colors"
                      title="Copiar código"
                    >
                      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </Row>
                <p className="text-xs text-text-tertiary">
                  Comparte este código con tu pareja para que se una a la casa
                </p>
              </>
            ) : (
              <Stack gap="md">
                {showJoinForm ? (
                  <>
                    <p className="text-text-secondary">Ingresa el código de casa para unirte</p>
                    <Input
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Ej: CASA-AB12"
                      autoFocus
                    />
                    {joinError && (
                      <p className="text-sm text-danger">{joinError}</p>
                    )}
                    <Row gap="sm">
                      <Button 
                        variant="secondary" 
                        onClick={() => {
                          setShowJoinForm(false);
                          setJoinCode('');
                          setJoinError('');
                        }}
                        disabled={joinMutation.isPending}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleJoin}
                        disabled={!joinCode.trim() || joinMutation.isPending}
                      >
                        {joinMutation.isPending ? 'Uniéndose...' : 'Unirse'}
                      </Button>
                    </Row>
                  </>
                ) : (
                  <>
                    <p className="text-text-secondary">No tienes una casa asociada</p>
                    <Row gap="sm">
                      <Button 
                        onClick={() => createHouseholdMutation.mutate('Mi Hogar')}
                        disabled={createHouseholdMutation.isPending}
                      >
                        {createHouseholdMutation.isPending ? 'Creando...' : 'Crear mi casa'}
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => setShowJoinForm(true)}
                      >
                        Unirse a casa
                      </Button>
                    </Row>
                  </>
                )}
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Members Card */}
        {profile?.members && profile.members.length > 0 && (
          <Card padding="lg">
            <Stack gap="md">
              <Row justify="between" align="center">
                <h2 className="text-lg font-semibold text-text-primary">Miembros de la casa</h2>
                <Users size={20} className="text-text-tertiary" />
              </Row>
              <div className="divide-y divide-border">
                {profile.members.map((member) => (
                  <Row key={member.id} justify="between" className="py-3">
                    <div>
                      <span className="font-medium text-text-primary">{member.name}</span>
                      <span className="text-text-tertiary text-sm ml-2">@{member.username}</span>
                    </div>
                    {member.id === authUser?.id && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Tú</span>
                    )}
                  </Row>
                ))}
              </div>
            </Stack>
          </Card>
        )}

        {/* Logout */}
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-danger"
        >
          <LogOut size={18} className="mr-2" />
          Cerrar sesión
        </Button>
      </Stack>
    </Container>
  );
}