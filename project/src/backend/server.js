import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { jsPDF } from 'jspdf';           // ✅ Import correct
import autoTable from 'jspdf-autotable'; 



const db = await open({
  filename: '/home/rachad/JOURNEE PORTE OUVERTE/project/visitors.db',
  driver: sqlite3.Database
});

 //await db.exec(`DROP TABLE IF EXISTS visitors`);
 await db.exec(`
  CREATE TABLE IF NOT EXISTS visitors (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,           -- Obligatoire
    prenom TEXT,                 -- Optionnel
    sexe TEXT,                   -- Optionnel
    age INTEGER,                 -- Optionnel
    profession TEXT,             -- Optionnel
    email TEXT,                  -- Optionnel
    photo TEXT,                  -- Optionnel
    institution TEXT,            -- Optionnel
    telephone TEXT,              -- Optionnel
    dateParticipation TEXT,      -- Optionnel
    certificatGenere INTEGER DEFAULT 0 -- Optionnel, par défaut à 0
  );
`);

const app = express();
app.use(cors());
app.use(express.json());

// GET all visitors
app.get('/visitors', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM visitors');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new visitor
app.post('/visitors', async (req, res) => {
    const v = req.body;
    try {
      await db.run(`
        INSERT INTO visitors (
          id, nom, prenom, sexe, age, profession, email,
          photo, institution, telephone, dateParticipation
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        v.id, v.nom, v.prenom, v.sexe, v.age, v.profession, v.email,
        v.photo, v.institution, v.telephone, v.dateParticipation
      ]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  



  app.post('/visitorss', async (req, res) => {
    const visiteurs = req.body;
  
    if (!Array.isArray(visiteurs)) {
      return res.status(400).json({ error: "Le corps de la requête doit être un tableau JSON." });
    }
  
    const insertQuery = `
      INSERT INTO visitors (
        id, nom, prenom, sexe, age, profession, email,
        photo, institution, telephone, dateParticipation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    try {
      for (const v of visiteurs) {
        await db.run(insertQuery, [
          v.id,
          v.nom,
          v.prenom ?? null,
          v.sexe ?? null,
          v.age ?? null,
          v.profession ?? "Élève",
          v.email ?? null,
          v.photo ?? null,
          v.institution ?? null,
          v.telephone ?? null,
          new Date().toISOString().split('T')[0] // dateParticipation = aujourd'hui
        ]);
      }
  
      res.json({ success: true, inserted: visiteurs.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });





app.get('/visitors/export/pdf', async (req, res) => {
  try {
    const visitors = await db.all('SELECT * FROM visitors');

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "Liste des Participants à la Journée Porte Ouverte";

    // 🖋️ Titre stylé
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 60); // Bleu foncé professionnel

    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;
    const y = 20;

    doc.text(title, x, y);

    // 🟦 Cadre stylé sous le titre
    doc.setDrawColor(44, 62, 80); // Gris-bleu foncé
    doc.setLineWidth(0.5);
    doc.line(10, y + 3, pageWidth - 10, y + 3);

    // 🧾 Colonnes du tableau
    const headers = [
      "Nom", "Prénom", "Sexe", "Âge", "Profession", "Email",
      "Institution", "Téléphone", "Date"
    ];

    const data = visitors.map(v => [
      v.nom, v.prenom, v.sexe, v.age, v.profession, v.email,
      v.institution, v.telephone, v.dateParticipation
    ]);

    // 📋 Table avec style pro
    autoTable(doc, {
      startY: y + 10,
      head: [headers],
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],     // Bleu pro
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 11,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 10,
        textColor: 50,
        lineColor: [220, 220, 220],
        halign: 'left',
      },
      alternateRowStyles: {
        fillColor: [245, 250, 255], // Bleu très clair
      },
      styles: {
        cellPadding: 3,
        overflow: 'linebreak',
        font: 'helvetica',
      },
      margin: { top: 20, left: 10, right: 10 },
    });

    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="participants_jpo.pdf"');
    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("Erreur génération PDF :", err);
    res.status(500).json({ error: "Erreur lors de la génération du PDF", details: err.message });
  }
});




app.listen(3001, () => console.log("API running on http://localhost:3001"));
