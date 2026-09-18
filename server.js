const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const pdfDir = path.join(__dirname, "pdfs");

if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "Patrick Date Backend"
    });
});

app.post("/gerar-pdf", (req, res) => {

    try {

        const {
            data,
            hora,
            local,
            roupa,
            observacoes
        } = req.body;

        if (!data || !hora || !local || !roupa) {
            return res.status(400).json({
                erro: "Dados obrigatórios ausentes."
            });
        }

        if (data < "2026-09-23") {
            return res.status(400).json({
                erro: "A data precisa ser posterior ao dia 22/09/2026."
            });
        }

        const registro =
            Math.floor(100 + Math.random() * 900);

        const nomeArquivo =
            `compromisso-patrick-${registro}.pdf`;

        const caminho =
            path.join(pdfDir, nomeArquivo);

        const doc = new PDFDocument({
            size: "A4",
            margins: {
                top: 60,
                bottom: 60,
                left: 55,
                right: 55
            }
        });

        const stream =
            fs.createWriteStream(caminho);

        doc.pipe(stream);

        doc
            .fontSize(9)
            .fillColor("#666666")
            .text(
                `REGISTRO Nº ${registro}`,
                {
                    align: "center",
                    characterSpacing: 3
                }
            );

        doc.moveDown(2);

        doc
            .fontSize(28)
            .fillColor("#171717")
            .text("♥", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(24)
            .fillColor("#171717")
            .text(
                "COMPROMISSO OFICIAL",
                {
                    align: "center",
                    characterSpacing: 1
                }
            );

        doc
            .fontSize(24)
            .text(
                "DE ENCONTRO",
                {
                    align: "center",
                    characterSpacing: 1
                }
            );

        doc.moveDown();

        doc
            .fontSize(11)
            .fillColor("#555555")
            .text(
                "Registro de compromisso afetivo",
                {
                    align: "center"
                }
            );

        doc.moveDown(2);

        doc
            .strokeColor("#777777")
            .moveTo(250, doc.y)
            .lineTo(345, doc.y)
            .stroke();

        doc.moveDown(2);

        doc
            .fontSize(15)
            .fillColor("#171717")
            .text(
                "Patrick Gabriel Jacinto Nunes",
                {
                    align: "center"
                }
            );

        doc
            .fontSize(13)
            .text("&", {
                align: "center"
            });

        doc
            .fontSize(15)
            .text(
                "Samuel Ferreira Duarte",
                {
                    align: "center"
                }
            );

        doc.moveDown(2);

        const detalhes = [
            ["DATA", formatarData(data)],
            ["HORÁRIO", hora],
            ["LOCAL", local],
            ["TRAJE ESCOLHIDO", roupa],
            ["OBSERVAÇÕES", observacoes || "Nenhuma."]
        ];

        detalhes.forEach(([titulo, valor]) => {

            doc
                .fontSize(8)
                .fillColor("#666666")
                .text(titulo, {
                    characterSpacing: 2
                });

            doc
                .fontSize(12)
                .fillColor("#171717")
                .text(valor);

            doc.moveDown(1);

            doc
                .strokeColor("#c7c3b9")
                .moveTo(55, doc.y)
                .lineTo(540, doc.y)
                .stroke();

            doc.moveDown(1);
        });

        doc.moveDown();

        doc
            .fontSize(10)
            .fillColor("#171717")
            .text(
                "ENCONTRO CONFIRMADO",
                {
                    align: "center",
                    characterSpacing: 2
                }
            );

        doc.moveDown(4);

        doc
            .fontSize(10)
            .fillColor("#171717")
            .text(
                "____________________________",
                {
                    align: "center"
                }
            );

        doc
            .fontSize(9)
            .text(
                "Patrick Gabriel Jacinto Nunes",
                {
                    align: "center"
                }
            );

        doc.moveDown(2);

        doc
            .fontSize(10)
            .text(
                "____________________________",
                {
                    align: "center"
                }
            );

        doc
            .fontSize(9)
            .text(
                "Samuel Ferreira Duarte",
                {
                    align: "center"
                }
            );

        doc.moveDown(3);

        doc
            .fontSize(8)
            .fillColor("#777777")
            .text(
                "Documento exclusivamente recreativo e romântico. ♥",
                {
                    align: "center"
                }
            );

        doc.end();

        stream.on("finish", () => {

            res.json({
                sucesso: true,
                registro,
                arquivo: nomeArquivo,
                caminho: `/pdfs/${nomeArquivo}`
            });

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao gerar PDF."
        });

    }

});

app.use(
    "/pdfs",
    express.static(pdfDir)
);

function formatarData(data) {

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;

}

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("================================");
    console.log(" PATRICK DATE BACKEND");
    console.log("================================");
    console.log(`Servidor: http://127.0.0.1:${PORT}`);
    console.log("Status: ONLINE");
    console.log("");

});
