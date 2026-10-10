import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT')) || 587;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS') || this.configService.get<string>('SMTP_PASSWORD');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true' || port === 465;

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user,
            pass,
          },
        });
        this.logger.log(`Service Mail SMTP initialisé avec succès (${host}:${port})`);
      } catch (err) {
        this.logger.error('Erreur lors de l\'initialisation du transporteur SMTP :', err);
      }
    } else {
      this.logger.warn(
        'Paramètres SMTP non renseignés (SMTP_HOST, SMTP_USER, SMTP_PASS). Les emails seront affichés dans la console.',
      );
    }
  }

  private getAppUrl(): string {
    const appUrl =
      this.configService.get<string>('APP_URL') ||
      this.configService.get<string>('FRONTEND_URL') ||
      'https://kanbanex.vercel.app';
    return appUrl.replace(/\/$/, '');
  }

  private getFromAddress(): string {
    return (
      this.configService.get<string>('SMTP_FROM') ||
      this.configService.get<string>('MAIL_FROM') ||
      '"KanbanEx" <no-reply@kanbanex.vercel.app>'
    );
  }

  /**
   * Envoie un email de vérification d'adresse avec lien unique
   */
  async sendVerificationEmail(email: string, fullName: string, token: string): Promise<boolean> {
    const appUrl = this.getAppUrl();
    const verificationUrl = `${appUrl}/verify-email?token=${token}`;

    const subject = 'Validez votre adresse email - KanbanEx';
    const textContent = `Bonjour ${fullName},\n\nMerci de rejoindre KanbanEx ! Pour valider votre compte, veuillez vous rendre sur le lien suivant :\n${verificationUrl}\n\nCe lien est valable 24 heures.\n\nSi vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.\n\nL'équipe KanbanEx`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Validation de compte KanbanEx</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0B0D11;
      color: #E2E8F0;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 580px;
      margin: 40px auto;
      background-color: #12151C;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .header {
      background: linear-gradient(135deg, #171B24 0%, #0E1117 100%);
      padding: 32px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }
    .logo-accent {
      color: #F97316;
    }
    .content {
      padding: 36px 32px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 16px;
    }
    .description {
      font-size: 15px;
      color: #94A3B8;
      margin-bottom: 28px;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #EA580C 0%, #D97706 100%);
      color: #FFFFFF !important;
      font-size: 15px;
      font-weight: 800;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(234, 88, 12, 0.35);
    }
    .fallback-box {
      background-color: #0B0D11;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 14px;
      margin-top: 24px;
      font-size: 12px;
      color: #64748B;
      word-break: break-all;
    }
    .fallback-box a {
      color: #FB923C;
      text-decoration: underline;
    }
    .footer {
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 12px;
      color: #64748B;
      background-color: #0E1117;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-text">Kanban<span class="logo-accent">Ex</span></span>
      </div>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #94A3B8;">Plateforme unifiée de gestion de projets agiles</p>
    </div>

    <div class="content">
      <div class="greeting">Bonjour ${fullName},</div>
      <p class="description">
        Bienvenue sur KanbanEx ! Pour finaliser la création de votre compte et accéder à votre espace de travail, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
      </p>

      <div class="btn-container">
        <a href="${verificationUrl}" class="btn" target="_blank">Valider mon adresse email</a>
      </div>

      <p style="font-size: 13px; color: #64748B; margin-top: 20px;">
        ⏱ Ce lien de validation est sécurisé et expire dans <strong>24 heures</strong>.
      </p>

      <div class="fallback-box">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br/>
        <a href="${verificationUrl}">${verificationUrl}</a>
      </div>
    </div>

    <div class="footer">
      © 2026 KanbanEx • Écosystème Expansion. Tous droits réservés.<br/>
      Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email en toute sécurité.
    </div>
  </div>
</body>
</html>
    `;

    // Mode SMTP
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.getFromAddress(),
          to: email,
          subject,
          text: textContent,
          html: htmlContent,
        });
        this.logger.log(`[SMTP] Email de validation envoyé avec succès à ${email}`);
        return true;
      } catch (err) {
        this.logger.error(`[SMTP] Échec d'envoi de l'email à ${email} :`, err);
        // Fallback: log link to console
        this.logVerificationLinkToConsole(email, verificationUrl);
        return false;
      }
    } else {
      // Mode simulation / dev console
      this.logVerificationLinkToConsole(email, verificationUrl);
      return true;
    }
  }

  private logVerificationLinkToConsole(email: string, url: string) {
    this.logger.warn(`
========================================================================
📧 [EMAIL SIMULATION] VALIDATION DE COMPTE KANBANEX
------------------------------------------------------------------------
Destinataire : ${email}
Lien direct  : ${url}
(Pour activer le vrai envoi par email, configurez SMTP_HOST, SMTP_USER et SMTP_PASS dans votre .env)
========================================================================
    `);
  }
}
