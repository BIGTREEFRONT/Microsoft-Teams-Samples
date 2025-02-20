using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace IdentityLinkingWithSSO.Pages
{
    public class tabModel : PageModel
    {
        private readonly IConfiguration _configuration;

        public string FacebookAppId { get; set; }

        public string GoogleAppId { get; set; }

        public string BaseUrl { get; set; }

        public tabModel(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void OnGet()
        {
            FacebookAppId = _configuration["FacebookAppId"];
            GoogleAppId = _configuration["GoogleAppId"];
            BaseUrl = _configuration["ApplicationBaseUrl"];
        }
    }
}