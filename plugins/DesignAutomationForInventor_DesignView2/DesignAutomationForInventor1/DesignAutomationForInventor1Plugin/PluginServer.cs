﻿/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

using System;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using Inventor;

namespace DesignAutomationForInventor1Plugin
{
    [Guid("c0bef4f1-f632-4b05-8b2c-16b74ca5ff73")]
    public class PluginServer : ApplicationAddInServer
    {
        // Inventor application object.
        InventorServer m_inventorServer;
        SampleAutomation m_automation;

        public dynamic Automation
        {
            get
            {
                return m_automation;
            }
        }

        public void Activate(ApplicationAddInSite AddInSiteObject, bool FirstTime)
        {
            Trace.TraceInformation(": DesignAutomationForInventor1Plugin (" + Assembly.GetExecutingAssembly().GetName().Version.ToString(4) + "): initializing... ");

            // Initialize AddIn members.
            m_inventorServer = AddInSiteObject.InventorServer;
            m_automation = new SampleAutomation(m_inventorServer);
        }

        public void Deactivate()
        {
            Trace.TraceInformation(": DesignAutomationForInventor1Plugin: deactivating... ");

            // Release objects.
            Marshal.ReleaseComObject(m_inventorServer);
            m_inventorServer = null;

            GC.Collect();
            GC.WaitForPendingFinalizers();
        }

        public void ExecuteCommand(int CommandID)
        {
            // obsolete
        }
    }
}
