import {
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

function Guide() {
  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <MenuBookIcon sx={{ fontSize: 40 }} color="primary" />
        <div>
          <Typography variant="h5" fontWeight={600}>
            Guía del Desarrollador
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Todo lo que necesitas saber para publicar y gestionar tus aplicaciones
          </Typography>
        </div>
      </Box>

      {/* Alert Intro */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Esta guía te ayudará a maximizar las ventas y ofrecer la mejor experiencia a tus usuarios.
      </Alert>

      {/* Section 1: URLs */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LinkIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              URLs de Aplicación
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            La <strong>URL de la aplicación</strong> es el enlace principal donde los usuarios
            accederán a tu app después de la compra.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✅ Usa URLs HTTPS seguras"
                secondary="Ejemplo: https://miapp.com/login"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✅ Verifica que la URL esté siempre activa"
                secondary="Los usuarios deben poder acceder 24/7"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="❌ No uses URLs temporales o de desarrollo"
                secondary="localhost, IPs temporales, etc."
              />
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" paragraph>
            <strong>URL de Demo (opcional):</strong> Ofrece una versión limitada para que los
            usuarios prueben tu app antes de comprar.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="La demo debe mostrar funcionalidades básicas sin requerir pago"
                secondary="Ejemplo: funciones limitadas, datos de prueba, acceso de solo lectura"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Section 2: Cover Images */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ImageIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Imágenes de Portada
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            Una buena imagen de portada aumenta significativamente las conversiones.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✅ Resolución mínima: 1200x630 px"
                secondary="Formato ideal 16:9 o 1.91:1"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✅ Usa imágenes claras que representen tu app"
                secondary="Screenshots, capturas de interfaz, logos profesionales"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✅ URLs de imágenes válidas y públicas"
                secondary="Deben ser accesibles sin autenticación"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="❌ Evita imágenes genéricas o de baja calidad"
                secondary="Las imágenes borrosas o irrelevantes reducen la confianza"
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              <strong>Nota:</strong> Si la URL de la imagen no carga, el sistema mostrará una imagen
              placeholder automáticamente.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Section 3: Pricing */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AttachMoneyIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Estrategia de Precios
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            Define un precio justo que refleje el valor de tu aplicación.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Apps gratuitas: $0.00"
                secondary="Ideal para ganar usuarios iniciales o modelos freemium"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Considera el mercado y la competencia"
                secondary="Investiga apps similares antes de fijar tu precio"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Ofrece demos gratuitas para apps de pago"
                secondary="Los usuarios tienden a comprar más cuando pueden probar primero"
              />
            </ListItem>
          </List>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              💡 <strong>Tip:</strong> Puedes actualizar el precio de tu app en cualquier momento
              desde el panel de edición.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Section 4: Credentials */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <VpnKeyIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Sistema de Credenciales
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              ✅ <strong>Automático:</strong> El sistema genera credenciales únicas automáticamente
              para cada compra.
            </Typography>
          </Alert>
          <Typography variant="body2" paragraph>
            Cuando un usuario compra tu app, recibe <strong>credenciales únicas</strong> en el
            siguiente formato:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              fontFamily: 'monospace',
              mb: 2,
            }}
          >
            <Typography variant="body2" component="pre" sx={{ color: 'text.primary', margin: 0 }}>
              {`{
  "username": "user_123_456",
  "password": "pass_abc123",
  "app_id": 123,
  "buyer_id": 456
}`}
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            <strong>Tu responsabilidad como desarrollador:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="🔐 Configura tu aplicación para aceptar estas credenciales"
                secondary="Implementa autenticación usando username/password proporcionados"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="🔐 Valida que el usuario tenga acceso legítimo"
                secondary="Puedes consultar el buyer_id para verificar compras"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="⚠️ No compartas credenciales manualmente"
                secondary="El sistema lo hace automáticamente al momento de la compra"
              />
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" paragraph>
            <strong>Campo Credentials Template (opcional):</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Puedes definir un template personalizado en formato JSON con instrucciones adicionales.
            Este campo es opcional y está reservado para futuras mejoras del sistema de
            autenticación.
          </Typography>
        </CardContent>
      </Card>

      {/* Section 5: Security */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <SecurityIcon color="error" />
            <Typography variant="h6" fontWeight={600}>
              Seguridad y Recomendaciones
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✅ Usa HTTPS en todas tus URLs"
                secondary="Protege la información de tus usuarios"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✅ Mantén tu aplicación actualizada y funcional"
                secondary="Los usuarios pueden dejar reseñas negativas si tu app no funciona"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="✅ Respeta la privacidad de los usuarios"
                secondary="No uses sus datos para propósitos no autorizados"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="⚠️ No vendas apps fraudulentas o maliciosas"
                secondary="Podrías ser removido de la plataforma"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Footer */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
        <Typography variant="body2" textAlign="center" color="primary.dark">
          <strong>🚀 ¡Éxito con tus publicaciones!</strong> Si tienes dudas, contacta al soporte de
          la plataforma.
        </Typography>
      </Box>
    </Box>
  );
}

export default Guide;
