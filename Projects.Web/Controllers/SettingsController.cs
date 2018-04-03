using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.MasterData;
using Projects.Entities.Membership;
using Projects.Services;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Extensions;

namespace Projects.Web.Controllers
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("api/settings")]
    public class SettingsController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_settings> _settingsRepository;


        public SettingsController(IEntityBaseRepository<tbl_settings> settingsRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository,IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
            {
                _settingsRepository = settingsRepository;

            }


        [AllowAnonymous]
        [Route("getSMTP")]
        public IHttpActionResult GetSMTP(HttpRequestMessage request)
        {
            DBConnect contextObj = new DBConnect();

            var smtp = (from rm in contextObj.refmaster
                            .Where(x => x.group_id == 1)
                        select new
                            {
                                id = rm.id,
                                ref_item = rm.reference_item,
                                ref_value = rm.reference_value,
                                ref_description = rm.description
                            });

            return Ok(smtp);
            //});
        }

      
    }
}
