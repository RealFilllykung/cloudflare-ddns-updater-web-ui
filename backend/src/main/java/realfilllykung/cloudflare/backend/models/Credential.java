package realfilllykung.cloudflare.backend.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class Credential { 
    @NotBlank(message = "credentialName should not be blank")
    @NotNull(message = "credentialName should not be null")
    @Size(max = 50, message = "credentialName should not exceed 50 characters")
    public String credentialName;
    
    @NotBlank(message = "zoneIdentifierId should not be blank")
    @NotNull(message = "zoneIdentifierId should not be null")
    public String zoneIdentifierId;
    
    @NotBlank(message = "apiKey should not be blank")
    @NotNull(message = "apiKey should not be null")
    public String apiKey;

    @NotBlank(message = "email should not be blank")
    @NotNull(message = "email should not be null")
    @Email(message = "email should be a valid email address")
    public String email; 
}