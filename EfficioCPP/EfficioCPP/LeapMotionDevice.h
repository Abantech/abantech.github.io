#pragma once
#include "Leap.h"
#include "IDevice.h"

#define EFFICIO_API __declspec(dllexport)

namespace Efficio {
	namespace Device {
		namespace LeapMotion {
			class LeapMotionDevice :
				public IDevice
			{
				Leap::Controller controller;

			public:
				EFFICIO_API LeapMotionDevice();
				EFFICIO_API ~LeapMotionDevice();
				void Initialize();

				std::string GetName();
				void Configure();
				void Start();
				void Stop();
				std::array<TrackingType, TrackingTypeCount> GetTrackingTypes();
			};
		}
	}
}
