using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
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
    [RoutePrefix("api/ErrorLog")]
    public class ErrorLogController : ApiControllerBase
    {
        //public readonly IEntityBaseRepository<tbl_error> _errorsRepository;
        public readonly IEntityBaseRepository<tbl_user> _userRepository;

        public ErrorLogController(IEntityBaseRepository<tbl_error> errorsRepository,
            IEntityBaseRepository<tbl_user> userRepository,
            IEntityBaseRepository<tbl_error> _errorReposity,
            IUnitOfWork _iUnitOfWork) : base(_errorReposity, _iUnitOfWork)
        {
            //_errorsRepository = errorsRepository;
            _userRepository = userRepository;
        }

        [AllowAnonymous]
        [Route("GetErrorLog")]
        public IHttpActionResult GetErrorLog(HttpRequestMessage request)
        {
            var errorslog = from e in _errorsRepository.GetAll().AsQueryable()
                           join u in _userRepository.GetAll().AsQueryable() on e.user_id equals u.id into p
                           from u in p.DefaultIfEmpty()
                           orderby (e.tenant_key)
                            select new
                           {
                               tenant_key = e.tenant_key,
                               user_name = u.user_name,
                               message = e.message,
                               stacktrace = e.stacktrace,
                               date_created = e.date_Created
                           };

            return Ok(errorslog);
        }
    }
}
