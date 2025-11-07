import React, { useState } from 'react';
import { Typography, Button, Box, Card, CardContent, Container, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Por ahora solo mostramos un mensaje de éxito
    toast.success('Mensaje enviado correctamente. Te contactaremos pronto.');

    // Limpiar formulario
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Contacto
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          ¿Tienes preguntas? Estamos aquí para ayudarte
        </Typography>
      </Box>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Asunto"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Mensaje"
                name="message"
                multiline
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                sx={{ alignSelf: 'flex-start' }}
              >
                Enviar Mensaje
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          También puedes contactarnos directamente en:
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          contacto@appswap.com
        </Typography>
      </Box>
    </Container>
  );
};

export default Contact;
