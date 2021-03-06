﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_workassigns:IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int ps_id { get; set; }
        public int junction_id { get; set; }
        public bool isAssigned { get; set; }
        public DateTime assigned_date { get; set; }
        public int subcontractor_id { get; set; }        
        public DateTime created_date { get; set; }
        public DateTime modified_date { get; set; }
       
    }
}
