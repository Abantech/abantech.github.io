using System;
using System.Collections.Generic;
using System.Net.Http;

namespace AutoDeskAuthNService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in both code and config file together.
    public class Service1 : IService1
    {
        private string address = "https://developer.api.autodesk.com/authentication/v1/authenticate";
        private string id = "lsUDMfaGxQQUACiSJLyAvleLzExcSAay";
        private string secret = "UXjvVHaBsKqudoVm";
        private Dictionary<string, string> args = new Dictionary<string, string>();

        public string GetAuthToken()
        {
            //if (args.Keys.Count.Equals(0))
            //{
            //    args.Add("client_id", id);
            //    args.Add("client_secret", secret);
            //    args.Add("grant_type", "client_credentials");
            //}

            //return GetToken();

            string token = new HttpClient().GetAsync("http://sleepy-river-3525.herokuapp.com/api/token").Result.Content.ReadAsStringAsync().Result;
            return token.Replace(Environment.NewLine, string.Empty);

        }

        private string GetToken()
        {
            string token = "";

            using (var client = new HttpClient())
            {
                var response = client.PostAsync(address, new FormUrlEncodedContent(args)).Result;
                token = response.Content.ReadAsStringAsync().Result;
                token = token.Replace(Environment.NewLine, string.Empty);
            }

            return token;
        }
    }
}
