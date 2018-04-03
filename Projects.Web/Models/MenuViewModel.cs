﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class MenuViewModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string url { get; set; }
        public string icon { get; set; }
        public string tooltip { get; set; }
        public int menu_order { get; set; }
        public string category { get; set; }
        public string menu_for { get; set; }
        public int? parent_menu { get; set; }
    }

}