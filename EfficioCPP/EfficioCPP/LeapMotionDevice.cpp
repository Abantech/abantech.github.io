#include "LeapMotionDevice.h"
#include <array>


namespace Efficio {
	namespace Device {
		namespace LeapMotion {
			LeapMotionDevice::LeapMotionDevice()
			{
			}
			LeapMotionDevice::~LeapMotionDevice()
			{
			}
			void LeapMotionDevice::Initialize()
			{
			}
			void LeapMotionDevice::Start()
			{
				controller = Leap::Controller();
			}
			void LeapMotionDevice::Stop()
			{
			}
			std::array<TrackingType, TrackingTypeCount> LeapMotionDevice::GetTrackingTypes()
			{
				return std::array<TrackingType, TrackingTypeCount> { TrackingType::Hand };
			}
			std::string LeapMotionDevice::GetName()
			{
				return "Leap Motion";
			}
			void LeapMotionDevice::Configure()
			{
			}
		}
	}
}