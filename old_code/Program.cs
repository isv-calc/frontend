using Json.Net;
using RestSharp;
using System;

namespace Testes
{
    public class Program
    {
        private const string requestBaseURL = "https://europe-west1-fire-functions-b6ad7.cloudfunctions.net/autoScout24?url=";

        private const string urlCarro = "https://www.autoscout24.com/offers/mercedes-benz-amg-gt-r-amg-gt-black-series-delivery-q3-2021-burmester-gasoline-117f9d50-0531-4384-a620-93ed4742c4cd";
        //private const string urlCarro = "https://suchen.mobile.de/auto-inserat/volkswagen-golf-vii-variant-comfortline-bmt-navi-acc-klima-kupferzell/327333638.html";

        static void Main(string[] args)
        {
            FazerSimulacao();

            Console.WriteLine("\nPrima Enter para introduzir mais um anúncio, ou outra tecla para sair.");
            if (Console.ReadKey().Key == ConsoleKey.Enter)
                Main(null);
        }

        private static void FazerSimulacao()
        {
            Console.Write("Introduza o link do anúncio: ");
            string adLink = Console.ReadLine();

            string requestLink = requestBaseURL + adLink;
            string responseText = GetDataFromAPI(requestLink);

            ResponseCarData respCar = JsonNet.Deserialize<ResponseCarData>(responseText);

            Car carroTeste = new Car(respCar.brand, respCar.model, respCar.price, respCar.year, respCar.month, respCar.mileage, respCar.fuel, respCar.displacement, respCar.emissions, respCar.isWltp, respCar.particulateFilter);

            #region info a dar print
            string queImpostos;
            if (carroTeste.TaxWithVat())
                queImpostos = "ISV + IVA a pagar: ";
            else
                queImpostos = "ISV a pagar: ";
            #endregion

            Console.WriteLine("\nMarca: {0}\nModelo: {1}\nPreço: {2}\n{3}{4}\n", carroTeste.Brand, carroTeste.Model, carroTeste.Price, queImpostos, carroTeste.GetISV().ToString("n"));
        }

        private static string GetDataFromAPI(string requestLink)
        {
            var client = new RestClient(requestLink);
            var request = new RestRequest(Method.GET);
            IRestResponse response = client.Execute(request);
            return response.Content.ToString();
        }
    }

    // Class to Receive the API data deserialized.
    public class ResponseCarData
    {
        public string brand;
        public string model;
        public double price;
        public int? year;
        public int? month;
        public int? emissions;
        public int displacement;
        public string fuel;
        public int? mileage;
        public bool isWltp;
        public bool particulateFilter;
    }
}