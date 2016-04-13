#pragma once
#include <string>
#include "TrackingType.h"

#define EFFICIO_CORE_API __declspec(dllexport)

namespace Efficio {
	namespace Device {
		class EFFICIO_CORE_API IDevice
		{
		public:
			virtual std::string GetName() = 0;
			virtual void Configure() = 0;
			virtual void Start() = 0;
			virtual void Stop() = 0;
			virtual std::array<TrackingType, TrackingTypeCount> GetTrackingTypes() = 0;
			// virtual	Frame GetFrame()
		};
	}
}