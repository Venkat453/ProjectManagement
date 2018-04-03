﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ProjectCommercialDataViewModel
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string Project_Code { get; set; }
        public string Project_Clasificaton { get; set; }
        public string Project_Sector { get; set; }
        public string Project_Currency { get; set; }
        public string LDfor_Delyed_Deliveryfor_Equp { get; set; }
        public string LDfor_Delyed_Deliveryfor_Draw { get; set; }
        public string Mile_Stone { get; set; }
        public string Per_Payments { get; set; }
        public string TriggeringPoint { get; set; }
        public string CompID { get; set; }
        public string Created_By { get; set; }
        public Nullable<System.DateTime> Created_On { get; set; }
        public string Modified_By { get; set; }
        public Nullable<System.DateTime> Modified_On { get; set; }
    }
}