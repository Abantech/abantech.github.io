#pragma once
#define EFFICIO_API __declspec(dllexport)
#include "Frame.h"
#include "Leap.h"

namespace Efficio {
	class EFFICIO_API Efficio
	{
		Leap::Controller controller;
	public:
		Efficio();
		~Efficio();
		Frame GetFrame();
	};

	// C++:
	extern "C" EFFICIO_API Efficio* CreateTestClass()
	{
		return new Efficio();
	}

	extern "C" EFFICIO_API bool FrameHasPinch(Efficio* frame)
	{
		return  frame->GetFrame().getPositions().size() > 0;
	}

	extern "C" EFFICIO_API void DisposeTestClass(
		Efficio* pObject)
	{
		if (pObject != NULL)
		{
			delete pObject;
			pObject = NULL;
		}
	}
}