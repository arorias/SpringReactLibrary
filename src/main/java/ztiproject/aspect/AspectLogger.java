package ztiproject.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.After;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.aspectj.lang.JoinPoint;


/**
 * <p> Klasa logujaca tranzakcje z wykorzystaniem programowania aspektowego SPRING AOP. </p>
 * @author Grzegorz Podsiadlo
 */
@Aspect
@Component
public class AspectLogger {
      
    /**
     * <p> Metoda logujaca dane dla joinPointa powiazanego ze wszystkimi zdarzeniami dla repozytorium ksiazki. </p>
     * @param joinPoint punkt po którym zostanie wykonany advice
     */
    @After("execution(* ztiproject.websocket.BookEventHandler.*(..))")       
    public void BookEventHandlerLogger(JoinPoint joinPoint)
    {
        System.out.println("AspectLogger.BookEventHandlerLogger() : Event : " + joinPoint.getSignature().getName() + " Argument: " + joinPoint.getArgs()[0]);
    }

    /**
     * <p> Metoda logujaca dane dla joinPointa powiazanego ze wszystkimi zdarzeniami dla repozytorium autorow. </p>
     * @param joinPoint punkt po którym zostanie wykonany advice
     */
    @After("execution(* ztiproject.websocket.AuthorEventHandler.*(..))")       
    public void AuthorEventHandlerLogger(JoinPoint joinPoint)
    {
        System.out.println("AspectLogger.AuthorEventHandlerLogger() : Event : " + joinPoint.getSignature().getName() + " Argument: " + joinPoint.getArgs()[0]);
    }

    /**
     * <p> Metoda logujaca dane dla joinPointa powiazanego ze wszystkimi zdarzeniami dla repozytorium wypozyczen. </p>
     * @param joinPoint punkt po którym zostanie wykonany advice
     */
    @After("execution(* ztiproject.websocket.BorrowedEventHandler.*(..))")       
    public void BorrowedEventHandlerLogger(JoinPoint joinPoint)
    {
        System.out.println("AspectLogger.BorrowedEventHandlerLogger() : Event : " + joinPoint.getSignature().getName() + " Argument: " + joinPoint.getArgs()[0]);
    }

    /**
     * <p> Metoda logujaca dane dla joinPointa powiazanego ze wszystkimi zdarzeniami dla repozytorium gatunku ksiazki. </p>
     * @param joinPoint punkt po którym zostanie wykonany advice
     */
    @After("execution(* ztiproject.websocket.CategoryEventHandler.*(..))")       
    public void CategoryEventHandlerLogger(JoinPoint joinPoint)
    {
        System.out.println("AspectLogger.CategoryEventHandlerLogger() : Event : " + joinPoint.getSignature().getName() + " Argument: " + joinPoint.getArgs()[0]);
    }

    /**
     * <p> Metoda logujaca dane dla joinPointa powiazanego ze wszystkimi zdarzeniami dla repozytorium rezerwacji ksiazki. </p>
     * @param joinPoint punkt po którym zostanie wykonany advice
     */
    @After("execution(* ztiproject.websocket.ReservationEventHandler.*(..))")       
    public void ReservationEventHandlerLogger(JoinPoint joinPoint)
    {
        System.out.println("AspectLogger.ReservationEventHandlerLogger() : Event : " + joinPoint.getSignature().getName() + " Argument: " + joinPoint.getArgs()[0]);
    }

}