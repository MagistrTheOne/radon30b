import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Shield, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  Lock, 
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function GdprPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                GDPR <span className="text-primary">запросы</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Реализуйте свои права в соответствии с Общим регламентом по защите данных (GDPR)
              </p>
              <div className="text-sm text-muted-foreground">
                Ваши права защищены европейским и российским законодательством
              </div>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ваши права по GDPR
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                В соответствии с GDPR у вас есть следующие права в отношении ваших персональных данных
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Право на доступ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Получите копию всех ваших персональных данных, которые мы обрабатываем
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Запросить данные
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Edit className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Право на исправление</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Исправьте неточные или неполные персональные данные
                  </p>
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Исправить данные
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Trash2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Право на удаление</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Удалите ваши персональные данные (&quot;право на забвение&quot;)
                  </p>
                  <Button variant="outline" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить данные
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Право на ограничение</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Ограничьте обработку ваших персональных данных
                  </p>
                  <Button variant="outline" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Ограничить обработку
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Право на портируемость</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Получите ваши данные в структурированном формате
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Экспортировать данные
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Право на возражение</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Возразите против обработки ваших данных
                  </p>
                  <Button variant="outline" className="w-full">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Подать возражение
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Request Form */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Подать GDPR запрос
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Заполните форму ниже, чтобы реализовать ваши права по GDPR
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Форма GDPR запроса
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Имя *</label>
                      <Input placeholder="Ваше имя" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <Input type="email" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Тип запроса *</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground" required>
                      <option value="">Выберите тип запроса</option>
                      <option value="access">Право на доступ к данным</option>
                      <option value="rectification">Право на исправление данных</option>
                      <option value="erasure">Право на удаление данных</option>
                      <option value="restriction">Право на ограничение обработки</option>
                      <option value="portability">Право на портируемость данных</option>
                      <option value="objection">Право на возражение</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Описание запроса *</label>
                    <Textarea 
                      placeholder="Подробно опишите ваш запрос..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Дополнительная информация</label>
                    <Textarea 
                      placeholder="Любая дополнительная информация, которая может помочь в обработке вашего запроса..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Способ получения ответа</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                      <option value="email">По email</option>
                      <option value="post">Почтой (укажите адрес в описании)</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="consent" required className="mt-1" />
                    <label htmlFor="consent" className="text-sm text-muted-foreground">
                      Я подтверждаю, что являюсь владельцем данных или имею право действовать от имени владельца данных. 
                      Я понимаю, что для обработки запроса может потребоваться дополнительная верификация моей личности.
                    </label>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Отправить GDPR запрос
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Processing Information */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Обработка запросов
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Информация о том, как мы обрабатываем ваши GDPR запросы
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Сроки обработки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Подтверждение получения: в течение 24 часов</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Обработка простых запросов: до 7 дней</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Сложные запросы: до 30 дней</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Продление срока: до 60 дней (с уведомлением)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Верификация личности
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Для защиты ваших данных мы можем запросить дополнительную верификацию:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Подтверждение email адреса</li>
                    <li>• Копия документа, удостоверяющего личность</li>
                    <li>• Дополнительные вопросы безопасности</li>
                    <li>• Подтверждение через аккаунт (если есть)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Контакты по GDPR
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Свяжитесь с нами для любых вопросов по защите персональных данных
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Ответственный за защиту данных</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>MagistrTheOne</p>
                  <p>Email: dpo@radonai.com</p>
                  <p>Адрес: Краснодар, Россия</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Общие вопросы по GDPR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p>Email: privacy@radonai.com</p>
                  <p>Время ответа: до 48 часов</p>
                  <p>Языки: Русский, Английский</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
