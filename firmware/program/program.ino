#include "EmonLib.h" 
#include <LiquidCrystal.h>
 
EnergyMonitor emon;
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

int emonPin = 1; 
// electrical network
int net = 220.0;
 
void setup() 
{
  lcd.begin(16, 2);
  lcd.clear();
  Serial.begin(9600);   
  
  // calibration - Ratio/BurdenResistor 1800/62 = 29.
  emon.current(emonPin, 29);
  
  lcd.setCursor(0,0);
  lcd.print("Curr.(A):");
  lcd.setCursor(0,1);
  lcd.print("Pow. (W):");
} 
  
void loop() 
{ 
  // calculates current
  double Irms = emon.calcIrms(1480);

  // shows current
  Serial.print("Current: ");
  Serial.print(Irms);
//  lcd.setCursor(10,0);
//  lcd.print(Irms);
   
  // calculates power
  Serial.print(" Power: ");
  Serial.println(Irms*net);
//  lcd.setCursor(10,1);
//  lcd.print("      ");
//  lcd.setCursor(10,1);
//  lcd.print(Irms*net,1);
   
//  delay(100);
}
