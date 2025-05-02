from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS

app = Flask(__name__)
# Menambahkan middleware CORS
CORS(app, resources={r"/api/*": {"origins": "https://sintesa.kemenkeu.go.id"}})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Mengambil data JSON dari request
        data = request.get_json()
        print("Data diterima: ", data)  # Untuk melihat apa yang dikirim dari frontend

        # Verifikasi bahwa semua field ada dan bernilai angka
        required_fields = ['real_perlinsos', 'pertumbuhan_pdrb', 'rata2_lama_sekolah', 'harapan_lama_sekolah', 'ipm',
                           'tenaga_kerja_formal', 'tk_informal_pertanian', 'tingkat_pengangguran', 'rasio_penggunaan_gas_rt', 'sumber_penerangan_listrik']

        for field in required_fields:
            if field not in data or not isinstance(data[field], (int, float)):
                return jsonify({"error": f"Invalid input for {field}. Must be a number."}), 400

        # Load model
        model = joblib.load('perlinsos_kemiskinan.pkl')

        # Ambil input dari data request
        X_input = [
            data['real_perlinsos'],
            data['pertumbuhan_pdrb'],
            data['rata2_lama_sekolah'],
            data['harapan_lama_sekolah'],
            data['ipm'],
            data['tenaga_kerja_formal'],
            data['tk_informal_pertanian'],
            data['tingkat_pengangguran'],
            data['rasio_penggunaan_gas_rt'],
            data['sumber_penerangan_listrik'],
        ]

        # Prediksi dengan model
        prediksi = model.predict([X_input])

        # Kembalikan hasil prediksi dalam format JSON
        return jsonify({"prediksi_tingkat_kemiskinan": prediksi[0]})
    
    except Exception as e:
        # Menangkap kesalahan dan memberikan pesan error
        return jsonify({"error": str(e)}), 400

# if __name__ == '__main__':
#     app.run(debug=True)

# if __name__ == '__main__':
#     app.run(host='10.216.208.138', port=5000, debug=True, ssl_context=('./ssl/sintesa_kemenkeu_go_id.key', './ssl/sintesa_kemenkeu_go_id.crt'))

# if __name__ == '__main__':
#     app.run(host='10.216.208.138', port=5000, debug=True, ssl_context=('sintesa_kemenkeu_go_id.key', 'sintesa_kemenkeu_go_id.key'))

if __name__ == '__main__':
    app.run(host='sintesa.kemenkeu.go.id', port=5000, debug=True, ssl_context=('./ssl/sintesa_kemenkeu_go_id.crt', './ssl/sintesa_kemenkeu_go_id.key'))

# if __name__ == '__main__':
    # app.run(host='10.216.208.138', port=5000, debug=True)
