using System;

namespace Testes
{
    public class Car
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public double Price { get; set; }
        public int? Mileage { get; set; }
        public DateTime Date { get; set; }
        public string FuelType { get; set; }
        public int EngineDisplacement { get; set; }
        public int CO2_Emiss { get; set; }
        public bool IsWLTP { get; set; }
        public bool HasOPF { get; set; }

        public Car(string brand, string model, double price, int? year, int? month, int? mileage, string fuelType, int engineDisp, int? co2_Emiss, bool isWLTP, bool hasOPF)
        {
            if (!co2_Emiss.HasValue)
            {
                Console.WriteLine("Emissões sem valor!");
                System.Environment.Exit(2);
            }

            Brand = brand;
            Model = model;
            Price = price;
            Date = new DateTime(year ?? DateTime.Now.Year, month ?? DateTime.Now.Month, 1); //TODO dia 1?
            Mileage = mileage;
            FuelType = fuelType;
            EngineDisplacement = engineDisp;
            CO2_Emiss = co2_Emiss.Value;
            IsWLTP = isWLTP;
            HasOPF = hasOPF;
        }

        public double GetISV()
        {
            double total = 0;

            double disp_Value = Math.Round(GetDisp_ISV_Value(), 2);
            Console.WriteLine("Componente da cm3: " + disp_Value);
            total += disp_Value;

            double co2_Value = Math.Round(GetCO2_ISV_Value(), 2);
            Console.WriteLine("Componente da CO2: " + co2_Value);
            total += co2_Value;


            // Diesel 500€ "Bonus"
            if (!HasOPF && FuelType.Equals("Diesel"))
                total += 500;

            // Last thing to do, add VAT
            if (TaxWithVat())
            {
                //Console.WriteLine("IVA: " + Math.Round(0.23 * (Price+total), 2)); // print número errado?
                total += 0.23 * (Price + total);
            }

            //TODO Benefícios

            return Math.Round(total, 2);
        }

        /// <summary>
        /// Checks if the Car is to be taxed with VAT
        /// </summary>
        public bool TaxWithVat()
        {
            // < 6 meses || <6.000 kms || fora UE
            if ((((DateTime.Today.Year - Date.Year) * 12) + DateTime.Today.Month - Date.Month) < 6 ||
                Mileage < 6000   /* TODO || Fora UE */
                )
            {
                return true;
            }
            else
                return false;
        }

        /// <summary>
        /// Calcula a parcela do ISV relativa às emissões CO2.
        /// </summary>
        /// <returns>Devolve o valor, já com o desconto da idade.</returns>
        private double GetCO2_ISV_Value()
        {
            double base_value = 0;

            // Get Base Value
            if (FuelType.Equals("Gasoline"))
            {
                if (IsWLTP)
                {
                    if (CO2_Emiss <= 110)
                        base_value = (CO2_Emiss * 0.40) - 39.00;
                    else if (CO2_Emiss <= 115)
                        base_value = (CO2_Emiss * 1.00) - 105.00;
                    else if (CO2_Emiss <= 120)
                        base_value = (CO2_Emiss * 1.25) - 134.00;
                    else if (CO2_Emiss <= 130)
                        base_value = (CO2_Emiss * 4.78) - 561.40;
                    else if (CO2_Emiss <= 145)
                        base_value = (CO2_Emiss * 5.79) - 691.55;
                    else if (CO2_Emiss <= 175)
                        base_value = (CO2_Emiss * 37.66) - 5276.50;
                    else if (CO2_Emiss <= 195)
                        base_value = (CO2_Emiss * 46.58) - 6571.10;
                    else if (CO2_Emiss <= 235)
                        base_value = (CO2_Emiss * 175.00) - 31000.00;
                    else
                        base_value = (CO2_Emiss * 212.00) - 38000.00;
                }
                else // NEDC
                {
                    if (CO2_Emiss <= 99)
                        base_value = (CO2_Emiss * 4.19) - 387.16;
                    else if (CO2_Emiss <= 115)
                        base_value = (CO2_Emiss * 7.33) - 680.91;
                    else if (CO2_Emiss <= 145)
                        base_value = (CO2_Emiss * 47.65) - 5353.01;
                    else if (CO2_Emiss <= 175)
                        base_value = (CO2_Emiss * 55.52) - 6473.88;
                    else if (CO2_Emiss <= 195)
                        base_value = (CO2_Emiss * 141.42) - 21422.47;
                    else
                        base_value = (CO2_Emiss * 186.47) - 30274.29;
                }
            }
            else if (FuelType.Equals("Diesel"))
            {
                if (IsWLTP)
                {
                    if (CO2_Emiss <= 110)
                        base_value = (CO2_Emiss * 1.56) - 10.43;
                    else if (CO2_Emiss <= 120)
                        base_value = (CO2_Emiss * 17.20) - 1728.32;
                    else if (CO2_Emiss <= 140)
                        base_value = (CO2_Emiss * 58.97) - 6673.96;
                    else if (CO2_Emiss <= 150)
                        base_value = (CO2_Emiss * 115.50) - 14580.00;
                    else if (CO2_Emiss <= 160)
                        base_value = (CO2_Emiss * 145.80) - 19200.00;
                    else if (CO2_Emiss <= 170)
                        base_value = (CO2_Emiss * 201.00) - 26500.00;
                    else if (CO2_Emiss <= 190)
                        base_value = (CO2_Emiss * 248.50) - 33536.42;
                    else
                        base_value = (CO2_Emiss * 256.00) - 34700.00;
                }
                else // NEDC
                {
                    if (CO2_Emiss <= 79)
                        base_value = (CO2_Emiss * 5.24) - 398.07;
                    else if (CO2_Emiss <= 95)
                        base_value = (CO2_Emiss * 21.26) - 1676.08;
                    else if (CO2_Emiss <= 120)
                        base_value = (CO2_Emiss * 71.83) - 6524.16;
                    else if (CO2_Emiss <= 140)
                        base_value = (CO2_Emiss * 159.33) - 17158.92;
                    else if (CO2_Emiss <= 160)
                        base_value = (CO2_Emiss * 177.19) - 19694.01;
                    else
                        base_value = (CO2_Emiss * 243.38) - 30326.67;
                }
            }
            else
            {
                //TODO
                throw new NotImplementedException();
            }

            // Desconto anos
            if (true) //TODO Se for UE
            {
                int years = GetYearsOld();

                switch (years)
                {
                    case 0:
                    case 1: // Até 2 anos
                        return base_value * (1 - 0.10);
                    case 2:
                    case 3: // 2-4
                        return base_value * (1 - 0.20);
                    case 4:
                    case 5:
                        return base_value * (1 - 0.28);
                    case 6: // Até 7
                        return base_value * (1 - 0.35);
                    case 7:
                    case 8: // Até 9
                        return base_value * (1 - 0.43);
                    case 9: // Até 10
                        return base_value * (1 - 0.52);
                    case 10:
                    case 11: // Até 12
                        return base_value * (1 - 0.60);
                    case 12: // Até 13
                        return base_value * (1 - 0.65);
                    case 13: // Até 14
                        return base_value * (1 - 0.70);
                    case 14: // Até 15
                        return base_value * (1 - 0.75);
                    default: // Mais de 15 anos
                        return base_value * (1 - 0.8);
                }
            }
            else
                return base_value;
        }

        private int GetYearsOld()
        {
            int days = (DateTime.Today - this.Date).Days;

            //assume 365.25 days per year
            int years = (int)(days / 365.25m);
            return years;
        }

        /// <summary>
        /// Calcula a parcela do ISV relativa à cilindrada.
        /// </summary>
        /// <returns>Devolve o valor, já com o desconto da idade.</returns>
        private double GetDisp_ISV_Value()
        {
            double base_value = 0;

            // Base Value
            if (EngineDisplacement < 1000)
                base_value = (EngineDisplacement * 0.99) - 769.80;
            else if (EngineDisplacement < 1250)
                base_value = (EngineDisplacement * 1.07) - 771.31;
            else
                base_value = (EngineDisplacement * 5.08) - 5616.80;

            // Desconto anos
            if (true) //TODO Se for UE
            {
                int years = GetYearsOld();

                return years switch
                {
                    // Até 1 ano
                    0 => base_value * (1 - 0.10),
                    // Até 2 anos
                    1 => base_value * (1 - 0.20),
                    2 => base_value * (1 - 0.28),
                    3 => base_value * (1 - 0.35),
                    4 => base_value * (1 - 0.43),
                    5 => base_value * (1 - 0.52),
                    6 => base_value * (1 - 0.60),
                    7 => base_value * (1 - 0.65),
                    8 => base_value * (1 - 0.70),
                    9 => base_value * (1 - 0.75),
                    // Mais de 10 anos
                    _ => base_value * (1 - 0.8),
                };
            }
            else
                return base_value;
        }
    }
} 