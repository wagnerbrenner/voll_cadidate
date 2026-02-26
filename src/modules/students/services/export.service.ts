import { Student } from '../../../types/student';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportService = {
  exportToCSV(students: Student[]) {
    const headers = ['Nome', 'Plano', 'Data de Início', 'Status'];
    const rows = students.map(s => [
      s.name,
      s.plan,
      new Date(s.plan_start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      s.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `alunos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToPDF(students: Student[]) {
    const doc = new jsPDF();
    
    doc.text('Lista de Alunos', 14, 15);
    
    const tableColumn = ['Nome', 'Plano', 'Data de Início', 'Status'];
    const tableRows = students.map(s => [
      s.name,
      s.plan,
      new Date(s.plan_start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      s.status
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`alunos_${new Date().toISOString().split('T')[0]}.pdf`);
  }
};
