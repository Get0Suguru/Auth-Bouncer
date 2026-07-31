package com.jujutsu.getoSuguru.AuthBouncer.service;

import com.jujutsu.getoSuguru.AuthBouncer.Payload.OtpVerifyRequest;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidLoginException;
import com.jujutsu.getoSuguru.AuthBouncer.exceptions.InvalidOtpException;
import com.jujutsu.getoSuguru.AuthBouncer.model.User;
import com.jujutsu.getoSuguru.AuthBouncer.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Spy                // gives me power to override methods of class
    @InjectMocks
    private OtpService otpService;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valOps;


    @Test
    public void verifyOtp_isFalse_whenOtpIsntEqual() {
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.get("OTP:r@mail.com")).thenReturn("5678", null);

        assertFalse(otpService.verifyOtp("r@mail.com", "1234"));
        verify(valOps, times(1)).get("OTP:r@mail.com");
    }

    @Test
    public void verifyOtp_isTrue_whenMatched() {
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(valOps.get("OTP:r@mail.com")).thenReturn("5678");

        assertTrue(otpService.verifyOtp("r@mail.com", "5678"));
        verify(valOps, times(1)).get("OTP:r@mail.com");
    }


    @Mock
    private UserRepository userRepo;

    @Test
    public void generateAndSaveOtp_createsAndSavesOtp() throws InvalidLoginException {
        when(redisTemplate.opsForValue()).thenReturn(valOps);
        when(userRepo.existsByEmail(any())).thenReturn(Boolean.TRUE);

        assertNotNull(otpService.generateAndSaveOtp("r@mail.com"));
        verify(valOps, times(1)).set(any(), any(), any());
    }


    @Test
    public void generateAndSaveOtp_throwsException_whenUserNotFound() throws InvalidLoginException {
        when(userRepo.existsByEmail(any())).thenReturn(false);
        assertThrows(InvalidLoginException.class, () -> {
            otpService.generateAndSaveOtp("r@mail.com");
        });
        verify(redisTemplate, never()).opsForValue();

    }

    @Mock
    private JavaMailSender mailSender;

    @Captor
    private ArgumentCaptor<SimpleMailMessage> msg;
    // captor is used to capture the arguments passed to the method
    // (mainly used for mocked methods to catch passed args)

    @Test
    public void sendOtpTest_sendOtp() {
        // this test should check 2 things -> i) the mailSender.send ran  ii) the correct args/msg were passed

        otpService.sendOtp("r@mail.com", "1234");

        // one hop method so no need to stub using (when then)
        verify(mailSender, times(1)).send(msg.capture());

        assertEquals("r@mail.com", msg.getValue().getTo()[0]);
        assertEquals("OTP Verification", msg.getValue().getSubject());
        assertEquals("Your OTP is: 1234 and will expire in 5 minutes", msg.getValue().getText());

        // SAAR -> easily observable that there are 2 things to check
        // i) weather .send called once or not
        // ii) weather the args passed are correct/correct format or not
    }

    // verifyOtpAndSendToken -> what should be tested here


    @Mock
    private HttpServletResponse httpResponse;

    @Test
    public void verifyOtpAndSendTokenTest_throwsException_whenInvalidOtp() throws InvalidOtpException {
        doReturn(false).when(otpService).verifyOtp(any(), any());
        assertThrows(InvalidOtpException.class, () -> {
            otpService.verifyOtpAndSendToken(new OtpVerifyRequest("r@mail.com", "1234"), mock(HttpServletResponse.class));
        });
        verifyNoInteractions(userRepo, jwtService, httpResponse);
    }

    @Mock
    private JWTService jwtService;

    // this should be testing
    // i) weather the accessToken returned or not
    // ii) weather the set-cookie header is set or not
    @Test
    public void verifyOptAndSendToken_returnsToken_WhenValidOtp() throws InvalidOtpException {

        // make if Skip
        doReturn(true).when(otpService).verifyOtp(any(), any());

        // mock user and forget it let User obj hold null
        when(userRepo.findByEmail(any())).thenReturn(new User());

        // mocked so passing any won't go bad -> will go if pass into something that's not mocked
        when(jwtService.generateAccessToken(any())).thenReturn("Access-Token");
        when(jwtService.generateRefreshToken(any())).thenReturn("Refresh-Token");

        String token = otpService.verifyOtpAndSendToken(new OtpVerifyRequest("r@mail.com", "1234"), httpResponse);

        // i) weather the accessToken returned or not
        assertEquals("Access-Token", token);

        // ii) weather the set-cookie header is set or not
        verify(httpResponse, times(1)).addHeader(eq("Set-Cookie"), contains("Refresh-Token"));
    }


}