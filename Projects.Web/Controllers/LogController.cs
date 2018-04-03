using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Projects.Web.Controllers
{

    [RoutePrefix("api/Log")]
    public class LogController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_Log> _LogRepository;  
        public LogController(IEntityBaseRepository<tbl_Log> LogRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
            _LogRepository = LogRepository; 
        }

        [HttpPost]
        [Route("SaveLog")]
        public HttpResponseMessage SaveLog(HttpRequestMessage request, LogViewModel log)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    string vIP = Library.HostAndIP.GetIP();
                    tbl_Log newlog = new tbl_Log();
                    newlog.userid = log.userid;
                    newlog.user_name = log.user_name;
                    newlog.ip_address = vIP;
                    newlog.page_url = log.page_url;
                    newlog.reference_url = log.reference_url;
                    newlog.created_date = DateTime.Now;
                    _LogRepository.Add(newlog);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<LogViewModel>(HttpStatusCode.Created, log);
                }
                return response;
            });
        }

    }
}