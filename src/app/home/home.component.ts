import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('stepTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)' }),
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})

export class HomeComponent {
  // Dados iniciais e variáveis de controle
  welcomeStep = true;
  currentStep = 1;
  totalSteps = 5;

  userName = '';
  guests: { name: string; buffetType: string | null }[] = [{ name: '', buffetType: null }];
  selectedGiftOption: string | null = null;
  houseGift: number | null = null;
  honeymoonGift: number = 0;
  total: number = 0;
  showPixPayment = false;
  pixCode = '00020126740014br.gov.bcb.pix0125maressahannah16@gmail.com0223Casamento Hannah e Joao5204000053039865802BR5925Hannah Maressa Mendes Rei6009Sao Paulo62070503***6304A178'; // Substitua pelo código Pix real
  whatsappLink = 'https://wa.me/9870220134?text=Envio%20do%20comprovante%20de%20pagamento';

  data = '20/12/2024'; // Exemplo de data
  horario = '20:00'; // Exemplo de horário
  localizacao = 'Churrascaria Sal e Brasa'; // Exemplo de localização

  ngOnInit() {
    if (this.userName) {
      this.guests[0].name = this.userName; // Define o nome inicial
    }
  }

  // Função para gerar o PDF
  gerarPDF() {
    const doc = new jsPDF();

    // Definindo fontes
    doc.setFont('helvetica', 'normal');
    
    // Título
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102); // Cor do texto
    doc.text('Confirmação de Presença', 20, 20);

    // Informações fixas (data, horário, localização)
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Cor preta para o texto fixo
    doc.text(`Data: ${this.data}`, 20, 40);
    doc.text(`Horário: ${this.horario}`, 20, 50);
    doc.text(`Localização: ${this.localizacao}`, 20, 60);

    // Separação de seção
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65); // Linha horizontal

    // Nome do usuário
    doc.setFontSize(14);
    doc.text(`Nome: ${this.userName}`, 20, 80);

    // Exibe os convidados
    let yPosition = 90;
    this.guests.forEach((guest, index) => {
      doc.setFontSize(12);
      doc.text(`Convidado ${index + 1}: ${guest.name}`, 20, yPosition);
      doc.text(`Buffet: ${guest.buffetType === 'adult' ? 'Adulto' : 'Criança'}`, 20, yPosition + 5);
      yPosition += 15;
    });

    // Exibe se o presente foi selecionado
    doc.text(`Presente Selecionado: ${this.selectedGiftOption === 'houseGift' ? 'Presente de Casa' : this.selectedGiftOption === 'honeymoonGift' ? 'Presente de Lua de Mel' : 'Nenhum'}`, 20, yPosition);

    // Adiciona o valor total
    doc.text(`Total: R$ ${this.total.toFixed(2)}`, 20, yPosition + 10);

    // Envia o PDF via WhatsApp
    doc.save('confirmacao_presenca.pdf');
    // this.enviarWhatsApp(doc);
  }

  // Funções existentes
  addGuest() {
    this.guests.push({ name: '', buffetType: null });
  }

  updateTotal() {
    this.total = 0;

    // Calcula total para cada convidado
    for (const guest of this.guests) {
      if (guest.buffetType === 'adult') {
        this.total += 84.9;
      } else if (guest.buffetType === 'child') {
        this.total += 50.94;
      }
    }

    // Adiciona valor do presente se selecionado
    if (this.selectedGiftOption === 'houseGift' && this.houseGift) {
      this.total += +this.houseGift; // Certifica-se que o valor é numérico
    } else if (this.selectedGiftOption === 'honeymoonGift' && this.honeymoonGift) {
      this.total += +this.honeymoonGift;
    }
  }

  goToNextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  finishSteps() {
    console.log("Etapas concluídas");
  }

  checkName() {
    this.userName = this.userName.trim();
  }

  startSteps() {
    this.welcomeStep = false;
  }

   // Função para copiar o código Pix
   copyPixCode() {
    navigator.clipboard.writeText(this.pixCode).then(() => {
      alert('Código Pix copiado para a área de transferência!');
    });
  }

  
}


