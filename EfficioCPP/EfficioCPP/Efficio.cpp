#include "Efficio.h"
#include <memory>
#include "Frame.h"
#include "Pinch.h"

namespace Efficio {
	Efficio::Efficio()
	{
	}

	Efficio::~Efficio()
	{
	}

	EFFICIO_API Frame Efficio::GetFrame()
	{
		Frame frame;

		Leap::Frame leapFrame = controller.frame();
		controller.setPolicy(Leap::Controller::PolicyFlag::POLICY_BACKGROUND_FRAMES);

		bool valid = leapFrame.isValid();

		if (valid)
		{
			if (leapFrame.hands().count() > 0)
			{
				Leap::HandList handList = leapFrame.hands();

				if (handList.rightmost().isRight())
				{
					Leap::Hand rightHand = handList.rightmost();
					auto thumbPoint = rightHand.fingers()[0].tipPosition();
					auto fingerPoint = rightHand.fingers()[1].tipPosition();
					float pinchDistance = thumbPoint.distanceTo(fingerPoint);

					if (pinchDistance < 30)
					{
						frame.AddPosition(Pinch());
					}
				}
			}
		}

		return frame;
	}
}