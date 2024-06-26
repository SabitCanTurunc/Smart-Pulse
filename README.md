# Veri Çekme ve Excel'e Yazdırma

Bu program, belirli bir tarih aralığındaki piyasa içi gün içi işlem geçmişini API'den çeker ve bu verileri bir Excel dosyasına ve ekrana yazdırır.

## Kullanım

1. Öncelikle `node-fetch` ve `exceljs` paketlerini yüklemelisiniz. Bunun için terminalde aşağıdaki komutları çalıştırabilirsiniz:

    ```bash
    npm install node-fetch
    npm install exceljs
    ```

2. Kodu çalıştırmak için terminalde aşağıdaki komutu çalıştırarak programı başlatabilirsiniz:

    ```bash
    node --experimental-modules main.mjs
    ```
```
``

4. Program çalıştığında, işlem verilerini içeren bir Excel dosyası oluşturulacaktır. Ayrıca, işlem verileri ekrana da yazdırılacaktır.

## Gereksinimler

- Node.js
- node-fetch
- exceljs

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakın.
