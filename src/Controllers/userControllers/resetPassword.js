const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../../models/user'); // Asegúrate de que esta ruta sea la correcta para tu modelo de usuario

// Clave secreta para el token de restablecimiento
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || 'clave_secreta_para_reset';

// Controlador para solicitar el restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'El usuario no existe.' });
    }

    // Generar un token de restablecimiento (válido por 1 hora)
    const resetToken = jwt.sign({ id: user.id }, RESET_TOKEN_SECRET, { expiresIn: '1h' });

    // Enviar correo electrónico con el token
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Cambia según tu proveedor de correo
      auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS, // Tu contraseña o clave de app
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetLink}" target="_blank">Restablecer contraseña</a>
             <p>Este enlace expira en 1 hora.</p>`,
    });

    return res.status(200).json({ message: 'Correo de restablecimiento enviado con éxito.' });
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    return res.status(500).json({ message: 'Ocurrió un error al enviar el correo.' });
  }
};

// Controlador para restablecer la contraseña
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
    console.log('decoded', decoded)

    // Buscar al usuario asociado con el token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'El usuario no existe o el token es inválido.' });
    }

    // Cifrar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'El token ha expirado. Por favor, solicita uno nuevo.' });
    }

    return res.status(500).json({ message: 'Ocurrió un error al restablecer la contraseña.' });
  }
};

module.exports = { requestPasswordReset, resetPassword };

