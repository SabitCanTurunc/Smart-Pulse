import fetch from 'node-fetch';
import ExcelJS from 'exceljs';
import readline from 'readline';

// Kullanıcıdan tarihleri almak için readline arayüzü oluştur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// API'den veri çekme 
async function fetchData(startDate, endDate) {
    const url = `https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?startDate=${startDate}&endDate=${endDate}`;

    try {
        console.log("Yukleniyor..")
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Veri çekme hatasi:', error);
    }
}

// Verileri Excel dosyasına ve ekrana yazdır
async function writeDataToExcel(groupedData, startDate, endDate) {
    const workbook = new ExcelJS.Workbook();
    const worksheetName = `${startDate}  ${endDate} verileri`;
    const worksheet = workbook.addWorksheet(worksheetName);

    // Başlıklar
    worksheet.addRow(["Conract", "Toplam İslem Tutari", "Toplam İslem Miktari", "Agirlikli Ortalama Fiyat", "Tarih ve Saat"]);


    //Ekrana yazdır
    console.log("Conract      Toplam İslem Tutari   Toplam İslem Miktari        Agirlikli Ortalama Fiyat            Tarih ve Saat");
    console.log("-".repeat(130));

    // Verileri Excel dosyasına yaz
    Object.keys(groupedData).forEach(conract => {
        const totalTradeQuantity = groupedData[conract].totalQuantity.toFixed(2);
        const totalTradeAmount = groupedData[conract].totalPrice.toFixed(2);
        const weightedAveragePrice = (groupedData[conract].totalPrice / groupedData[conract].totalQuantity).toFixed(2);
        const date = new Date(groupedData[conract].timestamp).toLocaleString('en-US', { timeZone: 'UTC' });

        worksheet.addRow([conract, totalTradeQuantity, totalTradeAmount, weightedAveragePrice, date]);
        console.log(`${conract}\t${totalTradeQuantity}\t\t\t${totalTradeAmount}\t\t\t${weightedAveragePrice}\t\t\t${date}`);
    });

    // Excel dosyasını kaydetme
    await workbook.xlsx.writeFile(`${worksheetName}.xlsx`);
}

// Ana fonksiyon
async function processData() {
    rl.question("Başlangıç tarihini girin (Örn: 2022-01-26): ", async function(startDate) {
        rl.question("Bitiş tarihini girin (Örn: 2022-01-26): ", async function(endDate) {
            const data = await fetchData(startDate, endDate);

            if (!data) {
                console.log('Veri bulunamadı.');
                rl.close();
                return;
            }

            const groupedData = {};

            // Verileri gruplama
            data.body.intraDayTradeHistoryList.forEach(item => {
                const conract = item.conract;
                if (conract.startsWith('PH')) {
                    const dateStr = item.date.substring(0, 10);
                    const hourStr = item.date.substring(11, 13);
                    const dateTime = new Date(`${dateStr}T${hourStr}:00:00`);
                    const timestamp = dateTime.getTime();

                    if (!groupedData[conract]) {
                        groupedData[conract] = {
                            timestamp: timestamp,
                            totalPrice: 0,
                            totalQuantity: 0
                        };
                    }

                    groupedData[conract].totalPrice += (item.price * item.quantity) / 10;
                    groupedData[conract].totalQuantity += item.quantity / 10;
                }
            });

            // Sonuçları tablo olarak gösterme

            // Excel dosyasına yazdırma
            await writeDataToExcel(groupedData, startDate, endDate);

            rl.close();
        });
    });
}

// Kullanım örneği
processData();
