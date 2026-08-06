import { supabase } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(request) {
    try {
        const body = await request.json();
        console.log('📥 Received:', body);
        
        const { 
            user_id, 
            new_balance,
            action, 
            amount 
        } = body;

        // Validation
        if (!user_id || new_balance === undefined) {
            return NextResponse.json(
                { error: 'User ID and new balance are required' },
                { status: 400 }
            );
        }

        // Get current user
        const { data: currentUser, error: fetchError } = await supabase
            .from('user_accounts')
            .select('balance')
            .eq('user_id', user_id)
            .single();

        if (fetchError) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // ✅ Update only balance and updated_at
        const { data, error } = await supabase
            .from('user_accounts')
            .update({
                balance: new_balance,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) {
            console.error('❌ Supabase error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Balance updated successfully',
            data: {
                user_id: user_id,
                old_balance: currentUser.balance,
                new_balance: data.balance
            }
        });

    } catch (error) {
        console.error('❌ Error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}