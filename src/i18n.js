import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translations: {
        'Sign Up': 'Sign Up',
        'Password mismatch': 'Password mismatch',
        Username: 'Username',
        'Display Name': 'Display Name',
        Password: 'Password',
        'Password Repeat': 'Password Repeat',
        Login: 'Login',
        Logout: 'Logout',
        Users: 'Users',
        Next: 'Next >',
        Previous: '< Previous',
        'Load Failure': 'Load Failure',
        'User Not Found': 'User Not Found',
        Edit: 'Edit',
        Save: 'Save',
        Cancel: 'Cancel',
        'Change Display Name': 'Change Display Name',
      }
    },
    tr: {
      translations: {
        'Sign Up': 'Kayıt Ol',
        'Password mismatch': 'Aynı şifreyi giriniz',
        Username: 'Kullanıcı Adı',
        'Display Name': 'Tercih Edilen İsim',
        Password: 'Şifre',
        'Password Repeat': 'Şifreyi Tekrarla',
        Login: 'Giriş Yap',
        Logout: 'Çıkış',
        Users: 'Kullanıcılar',
        Next: 'Sonraki >',
        Previous: '< Önceki',
        'Load Failure': 'Yükleme Başarısız',
        'User Not Found': 'Kullanıcı Bulunamadı',
        Edit: 'Düzenle',
        Save: 'Kaydet',
        Cancel: 'İptal Et',
        'Change Display Name': 'Görünür İsminizi Değiştirin',
      }
    }
  },
  fallbackLng: 'en',
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ','
  },
  react: {
    wait: true
  }
});

export default i18n;
