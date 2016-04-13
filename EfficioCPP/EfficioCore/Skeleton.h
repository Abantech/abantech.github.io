#pragma once
#include "Arm.h"
#include "Leg.h"
#include <array>

namespace Efficio {
	namespace Models {
		namespace Human {
			class Skeleton
			{
			public:
				Skeleton();
				~Skeleton();

				// Arm Data
				std::array<Arm, 2> GetArms();
				Arm GetRightArm();
				Arm GetLeftArm();

				// Leg Data
				std::array<Leg, 2> GetLegs();
				Leg GetLeftLeg();
				Leg GetRightLeg();
			};
		}
	}
}