'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface IDCardProps {
  student: {
    name: string;
    rollNumber: string;
  };
}

export default function IDCard({ student }: IDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    const element = cardRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [85, 55], // Standard ID card size in mm
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 55, 85);
    pdf.save(`${student.rollNumber}_ID_Card.pdf`);
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      {/* Visual ID Card */}
      <div
        ref={cardRef}
        className='w-[250px] h-[400px] bg-gradient-to-b from-indigo-600 to-indigo-800 text-white rounded-xl shadow-2xl p-6 flex flex-col items-center text-center border-4 border-white'
      >
        <div className='w-24 h-24 bg-gray-200 rounded-full mb-4 border-2 border-white overflow-hidden'>
          {/* Placeholder for Student Image */}
          <div className='flex items-center justify-center h-full text-gray-400'>
            Photo
          </div>
        </div>

        <h2 className='text-xl font-bold uppercase tracking-wider'>
          {student.name}
        </h2>

        <div className='bg-white text-indigo-900 w-full py-2 rounded-lg font-mono font-bold mb-4'>
          ID: {student.rollNumber}
        </div>

        <div className='mt-auto text-[10px] opacity-75'>
          <p>College of Engineering & Tech</p>
          <p>Valid until: 2027</p>
        </div>
      </div>

      <button
        onClick={downloadPDF}
        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'
      >
        Download PDF ID Card
      </button>
    </div>
  );
}
