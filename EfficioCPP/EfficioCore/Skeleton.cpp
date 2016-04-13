#include "Skeleton.h"
#include "Arm.h"
#include "Leg.h"

namespace Efficio {
	namespace Models {
		namespace Human {
			Skeleton::Skeleton()
			{
			}


			Skeleton::~Skeleton()
			{
			}

			std::array<Arm, 2> Skeleton::GetArms()
			{
				return std::array<Arm, 2>();
			}

			Arm Skeleton::GetRightArm()
			{
				return Arm();
			}

			Arm Skeleton::GetLeftArm()
			{
				return Arm();
			}

			std::array<Leg, 2> Skeleton::GetLegs()
			{
				return std::array<Leg, 2>();
			}

			Leg Skeleton::GetLeftLeg()
			{
				return Leg();
			}

			Leg Skeleton::GetRightLeg()
			{
				return Leg();
			}
		}
	}
}