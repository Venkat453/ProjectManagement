using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
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

namespace Projects.Web.Controllers
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("api/RefMaster")]
    public class RefMasterController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_reference_group_master> _refgroupmasterRepository;
        public readonly IEntityBaseRepository<tbl_reference_master> _refmasterRepository;

        public RefMasterController(IEntityBaseRepository<tbl_reference_group_master> refgroupmasterRepository, 
            IEntityBaseRepository<tbl_reference_master> refmasterRepository,
            IEntityBaseRepository<tbl_error> _errorReposity,
            IUnitOfWork _iUnitOfWork) : base(_errorReposity, _iUnitOfWork)
        {
            _refgroupmasterRepository = refgroupmasterRepository;
            _refmasterRepository = refmasterRepository;
        }

        [Route("GetRefMaster")]
        public IHttpActionResult GetRefMaster(HttpRequestMessage request)
        {
            var refitems = from rm in _refmasterRepository.GetAll().AsQueryable()
                            join rgm in _refgroupmasterRepository.GetAll().AsQueryable() on rm.group_id equals rgm.id into p
                            from rgm in p.DefaultIfEmpty()
                            orderby (rm.group_id)
                            select new
                            {
                                refID = rm.id,
                                group_id = rm.group_id,
                                refGroup = rgm.reference_item,
                                refItem = rm.reference_item,
                                refValue = rm.reference_value,
                                description = rm.description
                            };

            return Ok(refitems);
        }
    }
}