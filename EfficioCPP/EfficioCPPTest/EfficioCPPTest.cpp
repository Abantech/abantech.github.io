// EfficioCPPTest.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include <Efficio.h>


int main()
{
	Efficio::Efficio efficio;
	auto frame = efficio.GetFrame();

	do
	{
		frame = efficio.GetFrame();
	} while (frame.getPositions().size() < 1);

    return 0;
}

