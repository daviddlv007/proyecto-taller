import {
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SecurityIcon from '@mui/icons-material/Security';

function Guide() {
  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <MenuBookIcon sx={{ fontSize: 40 }} color="primary" />
        <div>
          <Typography variant="h5" fontWeight={600}>
            Guía del Usuario
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Todo lo que necesitas saber para explorar, comprar y usar aplicaciones
          </Typography>
        </div>
      </Box>

      {/* Alert Intro */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Esta guía te ayudará a aprovechar al máximo la plataforma y encontrar las mejores
        aplicaciones para tus necesidades.
      </Alert>

      {/* Section 1: Explorar Apps */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <SearchIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Explorar y Buscar Aplicaciones
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            La plataforma te ofrece múltiples herramientas para encontrar la aplicación perfecta:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="🔍 Búsqueda por nombre o descripción"
                secondary="Usa palabras clave para encontrar apps específicas"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="📁 Filtrado por categoría"
                secondary="Navega por diferentes categorías: Productividad, Educación, Finanzas, etc."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="💰 Filtrado por rango de precio"
                secondary="Encuentra apps dentro de tu presupuesto"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="⭐ Filtrado por calificación"
                secondary="Ordena por mejor valoradas para encontrar apps de calidad"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Section 2: Proceso de Compra */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ShoppingCartIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Proceso de Compra
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            Comprar una aplicación en nuestra plataforma es simple y seguro:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  1
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary="Explora la app en detalle"
                secondary="Revisa descripción, precio, calificaciones y reseñas de otros usuarios"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  2
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary="Prueba la demo (si está disponible)"
                secondary="Muchas apps ofrecen una versión demo para que pruebes antes de comprar"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  3
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary="Haz clic en 'Comprar Ahora'"
                secondary="El sistema procesará tu compra automáticamente"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  4
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary="Accede a tus credenciales"
                secondary="Recibirás credenciales de acceso instantáneamente en la sección 'Mis Compras'"
              />
            </ListItem>
          </List>
          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>✨ Compra instantánea:</strong> No necesitas esperar confirmaciones ni procesos
            de pago complejos. Tu compra se confirma al instante y recibes acceso inmediato.
          </Alert>
        </CardContent>
      </Card>

      {/* Section 3: Credenciales de Acceso */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <VpnKeyIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Credenciales y Acceso a tus Apps
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            Después de comprar una app, recibirás credenciales únicas para acceder:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="📧 Usuario y contraseña personalizados"
                secondary="Cada compra genera credenciales únicas para tu seguridad"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="🔐 Acceso permanente"
                secondary="Tus credenciales no expiran, puedes acceder cuando quieras"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="👀 Ver credenciales en cualquier momento"
                secondary="En 'Mis Compras', haz clic en 'Ver Credenciales' para acceder a tus datos"
              />
            </ListItem>
          </List>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <strong>⚠️ Importante:</strong> Mantén tus credenciales seguras y no las compartas con
            terceros. Son personales e intransferibles.
          </Alert>
        </CardContent>
      </Card>

      {/* Section 4: Mis Compras */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PaymentIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Gestión de Mis Compras
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            En la sección <strong>"Mis Compras"</strong> puedes gestionar todas tus aplicaciones
            adquiridas:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Ver todas tus apps compradas"
                secondary="Historial completo con detalles de cada compra"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Acceder directamente a las apps"
                secondary="Botón 'Abrir App' te lleva directamente a la aplicación"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Ver tus credenciales de acceso"
                secondary="Modal seguro con usuario y contraseña listos para copiar"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Escribir reseñas"
                secondary="Comparte tu experiencia para ayudar a otros usuarios"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Section 5: Reseñas */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <RateReviewIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Sistema de Reseñas
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            Las reseñas son fundamentales para la comunidad. Tu opinión ayuda a otros usuarios:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="⭐ Califica del 1 al 5 estrellas"
                secondary="Refleja tu nivel de satisfacción con la aplicación"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="💬 Escribe un comentario"
                secondary="Comparte detalles sobre tu experiencia, pros y contras"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="🔒 Solo puedes reseñar apps compradas"
                secondary="Esto garantiza que todas las opiniones son de usuarios reales"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✍️ Una reseña por app"
                secondary="Mantén tu opinión actualizada y relevante"
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>💡 Consejo:</strong> Las reseñas honestas y detalladas son las más útiles para
            la comunidad.
          </Alert>
        </CardContent>
      </Card>

      {/* Section 6: Recomendaciones */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <SecurityIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Recomendaciones Personalizadas
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            En tu Dashboard encontrarás recomendaciones personalizadas basadas en:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="🎯 Tus compras anteriores"
                secondary="Apps similares a las que ya adquiriste"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="⭐ Apps mejor valoradas"
                secondary="Las favoritas de la comunidad en cada categoría"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="🆕 Nuevas aplicaciones"
                secondary="Descubre las últimas incorporaciones al catálogo"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Section 7: Seguridad */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <SecurityIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Seguridad y Privacidad
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="🔐 Tus datos están protegidos"
                secondary="Usamos cifrado y mejores prácticas de seguridad"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="💳 Compras seguras"
                secondary="Todas las transacciones son procesadas de forma segura"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="👤 Privacidad garantizada"
                secondary="No compartimos tu información con terceros"
              />
            </ListItem>
          </List>
          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>✅ Compromiso:</strong> Tu seguridad y privacidad son nuestra prioridad.
          </Alert>
        </CardContent>
      </Card>

      {/* Footer */}
      <Box mt={4} p={2} bgcolor="action.hover" borderRadius={2}>
        <Typography variant="body2" color="text.secondary" align="center">
          ¿Tienes más preguntas? Visita nuestra sección de contacto o explora la plataforma.
        </Typography>
      </Box>
    </Box>
  );
}

export default Guide;
