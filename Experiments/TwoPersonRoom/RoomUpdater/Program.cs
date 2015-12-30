using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoomUpdater
{
    class Program
    {
        static void Main(string[] args)
        {
            var su = new SceneUpdater();
            su.StartBroadcast();

            int points = 1;
            double radius = 100;

            double step = ((3.14 * 2) / points);
            double x, y, current = 0;
            for (int i = 0; i < points; i++)
            {
                x = Math.Round(Math.Sin(current) * radius);
                y = Math.Round(Math.Cos(current) * radius);

                Console.WriteLine($"point: {i} x:{x} y:{y}\n");

                current += step;
            }

            Console.ReadLine();
        }
    }
}
